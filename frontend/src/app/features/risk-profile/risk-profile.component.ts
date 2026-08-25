import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { RiskProfileService } from '../../core/services/risk-profile.service';

interface Question {
  id: number;
  text: string;
  options: { text: string; score: number }[];
}

@Component({
  selector: 'app-risk-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 text-text-main max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Financial Risk Profiling</h1>
        <p class="text-text-sub text-sm">Assess your investment risk profile to align asset allocations.</p>
      </div>

      <!-- State: Loading -->
      <div *ngIf="loading" class="p-12 text-center text-xs text-text-sub">
        Analyzing your financial profile...
      </div>

      <!-- State: Profile Exists -->
      <div *ngIf="!loading && currentProfile && !takingTest" class="bg-white border border-brand-border p-8 rounded-2xl shadow-sm text-center space-y-6">
        <div class="w-16 h-16 mx-auto rounded-full bg-brand-primary-light text-brand-primary flex items-center justify-center text-3xl shadow-sm border border-brand-border">
          🛡️
        </div>
        
        <div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Your Risk Profile</span>
          <h2 class="text-3xl font-black text-brand-primary-dark mt-1">{{ currentProfile.profileType }}</h2>
          <p class="text-xs text-text-sub mt-2">Risk Assessment Score: {{ currentProfile.riskScore }} / 100</p>
        </div>

        <!-- Asset Allocation Suggestion -->
        <div class="border-t border-brand-border pt-6 space-y-4 text-left">
          <h4 class="text-xs font-bold text-text-main uppercase tracking-wider">Recommended Asset Allocation</h4>
          
          <div class="space-y-3">
            <div *ngFor="let asset of getRecommendedAllocation(currentProfile.profileType)" class="space-y-1">
              <div class="flex justify-between text-xs font-semibold">
                <span>{{ asset.name }}</span>
                <span>{{ asset.pct }}%</span>
              </div>
              <div class="w-full bg-brand-bg rounded-full h-2">
                <div [class]="asset.color" class="h-2 rounded-full" [style.width.%]="asset.pct"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button 
            (click)="startQuiz()" 
            class="px-5 py-2.5 bg-brand-primary-light hover:bg-brand-primary text-brand-primary-dark hover:text-white rounded-xl text-xs font-bold border border-brand-primary transition-all duration-200 focus:outline-none"
          >
            🔄 Retake Assessment
          </button>
        </div>
      </div>

      <!-- State: Taking Test (Quiz Carousel) -->
      <div *ngIf="!loading && (!currentProfile || takingTest)" class="bg-white border border-brand-border p-8 rounded-2xl shadow-sm space-y-6">
        <!-- Progress bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-[10px] font-bold text-text-sub uppercase tracking-wider">
            <span>Question {{ currentStep + 1 }} of {{ questions.length }}</span>
            <span>{{ getQuizProgressPercentage() | number:'1.0-0' }}% Done</span>
          </div>
          <div class="w-full bg-brand-bg rounded-full h-1.5 overflow-hidden">
            <div class="bg-brand-primary h-1.5 rounded-full transition-all duration-300" [style.width.%]="getQuizProgressPercentage()"></div>
          </div>
        </div>

        <!-- Question -->
        <div class="space-y-3">
          <h3 class="text-lg font-bold text-text-main leading-tight">{{ questions[currentStep].text }}</h3>
          <p class="text-xs text-text-sub">Select the option that best fits your situation.</p>
        </div>

        <!-- Options selectable list -->
        <div class="space-y-3">
          <button 
            *ngFor="let opt of questions[currentStep].options" 
            (click)="selectOption(opt.score)"
            [class.border-brand-primary]="selectedAnswers[currentStep] === opt.score"
            [class.bg-brand-primary-light]="selectedAnswers[currentStep] === opt.score"
            class="w-full p-4 border border-brand-border hover:bg-brand-bg text-left rounded-2xl transition-all duration-150 focus:outline-none flex justify-between items-center"
          >
            <span class="text-xs font-semibold text-text-main">{{ opt.text }}</span>
            <div class="w-4 h-4 rounded-full border border-brand-border flex items-center justify-center" [class.bg-brand-primary]="selectedAnswers[currentStep] === opt.score">
              <div class="w-1.5 h-1.5 bg-white rounded-full" *ngIf="selectedAnswers[currentStep] === opt.score"></div>
            </div>
          </button>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between pt-4 border-t border-brand-border">
          <button 
            [disabled]="currentStep === 0" 
            (click)="goBack()" 
            class="px-4 py-2 border border-brand-border rounded-xl text-xs font-bold text-text-sub disabled:opacity-50 focus:outline-none"
          >
            Back
          </button>
          
          <button 
            *ngIf="currentStep < questions.length - 1"
            [disabled]="selectedAnswers[currentStep] === undefined"
            (click)="goNext()" 
            class="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-xl disabled:opacity-50 focus:outline-none shadow-sm"
          >
            Next
          </button>

          <button 
            *ngIf="currentStep === questions.length - 1"
            [disabled]="selectedAnswers[currentStep] === undefined || submitting"
            (click)="finishQuiz()" 
            class="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-xl disabled:opacity-50 focus:outline-none shadow-sm"
          >
            {{ submitting ? 'Calculating...' : 'Finish Assessment' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class RiskProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private riskProfileService = inject(RiskProfileService);

  loading = true;
  takingTest = false;
  submitting = false;
  currentProfile: any | null = null;
  userId = '';

  // Quiz State
  currentStep = 0;
  selectedAnswers: number[] = [];

  questions: Question[] = [
    {
      id: 1,
      text: 'How long do you plan to hold your investments?',
      options: [
        { text: 'Short-term: Less than 2 years', score: 10 },
        { text: 'Medium-term: 2 to 5 years', score: 20 },
        { text: 'Long-term: More than 5 years', score: 30 }
      ]
    },
    {
      id: 2,
      text: 'If your portfolio valuation dropped by 20% in a market correction, what would you do?',
      options: [
        { text: 'Panic and sell everything immediately to secure remaining cash', score: 10 },
        { text: 'Do nothing and patiently wait for a market recovery', score: 20 },
        { text: 'Buy more shares/units at the discounted price', score: 30 }
      ]
    },
    {
      id: 3,
      text: 'What is your primary investment goal?',
      options: [
        { text: 'Capital preservation: I do not want to lose any principal money', score: 10 },
        { text: 'Balanced: Moderate growth with a mix of risk and safety', score: 20 },
        { text: 'Wealth expansion: High growth potential, accepting volatility', score: 30 }
      ]
    },
    {
      id: 4,
      text: 'Describe your knowledge of financial markets and products.',
      options: [
        { text: 'Beginner: I rely on bank savings or fixed deposits only', score: 10 },
        { text: 'Intermediate: I understand mutual funds, SIPs and basic stocks', score: 20 },
        { text: 'Advanced: I actively track equity, derivatives, and crypto assets', score: 30 }
      ]
    }
  ];

  ngOnInit() {
    const session = this.authService.currentUser();
    if (session) {
      this.userId = session.userId;
      this.loadRiskProfile();
    }
  }

  loadRiskProfile() {
    this.loading = true;
    this.riskProfileService.getRiskProfile(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.currentProfile = res.data;
        }
        this.loading = false;
      },
      error: () => {
        // No risk profile exists yet
        this.currentProfile = null;
        this.loading = false;
      }
    });
  }

  startQuiz() {
    this.takingTest = true;
    this.currentStep = 0;
    this.selectedAnswers = [];
  }

  getQuizProgressPercentage(): number {
    return ((this.currentStep + 1) / this.questions.length) * 100;
  }

  selectOption(score: number) {
    this.selectedAnswers[this.currentStep] = score;
  }

  goBack() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goNext() {
    if (this.currentStep < this.questions.length - 1) {
      this.currentStep++;
    }
  }

  finishQuiz() {
    this.submitting = true;
    
    // Sum scores
    const totalScore = this.selectedAnswers.reduce((a, b) => a + b, 0);
    // Convert 40-120 score range to a 0-100 scale value
    const normalizedScore = Math.round(((totalScore - 40) / 80) * 100);

    let profileType = 'MODERATE';
    if (totalScore <= 60) {
      profileType = 'CONSERVATIVE';
    } else if (totalScore >= 95) {
      profileType = 'AGGRESSIVE';
    }

    const payload = {
      userId: this.userId,
      riskScore: normalizedScore,
      profileType
    };

    if (this.currentProfile) {
      this.riskProfileService.updateRiskProfile(this.currentProfile.profileId, payload).subscribe({
        next: (res: any) => {
          this.currentProfile = res.data;
          this.takingTest = false;
          this.submitting = false;
        },
        error: (err) => {
          this.submitting = false;
          alert('Failed to save assessment results.');
        }
      });
    } else {
      this.riskProfileService.createRiskProfile(payload).subscribe({
        next: (res: any) => {
          this.currentProfile = res.data;
          this.takingTest = false;
          this.submitting = false;
        },
        error: (err) => {
          this.submitting = false;
          alert('Failed to create risk profile.');
        }
      });
    }
  }

  getRecommendedAllocation(type: string): any[] {
    switch (type) {
      case 'CONSERVATIVE':
        return [
          { name: 'Fixed Income / Debt', pct: 60, color: 'bg-emerald-500' },
          { name: 'Mutual Funds / Large Cap', pct: 30, color: 'bg-purple-400' },
          { name: 'Cash Reserves', pct: 10, color: 'bg-blue-400' }
        ];
      case 'AGGRESSIVE':
        return [
          { name: 'Equity / Growth Stocks', pct: 60, color: 'bg-purple-400' },
          { name: 'Mutual Funds / Sectoral', pct: 25, color: 'bg-brand-primary' },
          { name: 'Fixed Income / Cash', pct: 15, color: 'bg-emerald-500' }
        ];
      default: // MODERATE
        return [
          { name: 'Mutual Funds / Index Funds', pct: 40, color: 'bg-purple-400' },
          { name: 'Equity / Large Cap Stocks', pct: 30, color: 'bg-brand-primary' },
          { name: 'Fixed Deposits / Bonds', pct: 20, color: 'bg-emerald-500' },
          { name: 'Cash', pct: 10, color: 'bg-blue-400' }
        ];
    }
  }
}
