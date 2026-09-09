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
    <div class="space-y-8 text-text-main max-w-2xl mx-auto pb-10">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-left">
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Financial Risk Profiling</h1>
            <span *ngIf="isDemoMode" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30">
              Demo Values Active
            </span>
          </div>
          <p class="text-text-sub text-sm mt-1">Assess your investment risk tolerance to optimize asset allocations.</p>
        </div>

        <!-- Controls: Demo Toggle & Guide Pills -->
        <div class="flex items-center gap-2">
          <button 
            (click)="toggleGuide()" 
            class="text-xs font-semibold px-3 py-1.5 rounded-2xl border transition-all duration-200 flex items-center gap-1 shadow-sm"
            [ngClass]="showGuide ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-text-sub border-brand-border hover:bg-brand-bg'"
          >
            <span>💡</span>
            <span>{{ showGuide ? 'Hide Guide' : 'What is Where?' }}</span>
          </button>

          <div class="flex items-center bg-white border border-brand-border rounded-2xl p-1 shadow-sm">
            <button 
              (click)="setMode(true)" 
              class="text-xs font-semibold px-3 py-1 rounded-xl transition-all duration-150"
              [ngClass]="isDemoMode ? 'bg-brand-primary-light text-brand-primary-dark font-bold' : 'text-text-sub hover:text-text-main'"
            >
              Sample
            </button>
            <button 
              (click)="setMode(false)" 
              class="text-xs font-semibold px-3 py-1 rounded-xl transition-all duration-150"
              [ngClass]="!isDemoMode ? 'bg-brand-primary-light text-brand-primary-dark font-bold' : 'text-text-sub hover:text-text-main'"
            >
              Live
            </button>
          </div>
        </div>
      </div>

      <!-- State: Loading -->
      <div *ngIf="loading" class="p-12 text-center text-xs text-text-sub">
        Analyzing your financial profile...
      </div>

      <!-- State: Profile Exists -->
      <div *ngIf="!loading && currentProfile && !takingTest" class="bg-white border border-brand-border p-8 rounded-2xl shadow-sm text-center space-y-6 relative overflow-hidden">
        <div *ngIf="showGuide" class="inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md mb-2">
          📍 Risk Tolerance Score: Evaluates volatility threshold & suggests portfolio split
        </div>

        <div class="w-16 h-16 mx-auto rounded-full bg-brand-primary-light text-brand-primary flex items-center justify-center text-3xl shadow-sm border border-brand-border">
          🛡️
        </div>
        
        <div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Your Assigned Profile</span>
          <h2 class="text-3xl font-black text-brand-primary-dark mt-1">{{ currentProfile.profileType }}</h2>
          <p class="text-xs text-text-sub mt-2 font-medium">Calculated Risk Score: {{ currentProfile.riskScore }} / 100</p>
        </div>

        <!-- Asset Allocation Suggestion -->
        <div class="border-t border-brand-border pt-6 space-y-4 text-left">
          <div class="flex justify-between items-center">
            <h4 class="text-xs font-bold text-text-main uppercase tracking-wider">Target Asset Mix</h4>
            <span class="text-[10px] text-text-sub font-semibold">Customized for {{ currentProfile.profileType }} investors</span>
          </div>
          
          <div class="space-y-3">
            <div *ngFor="let asset of getRecommendedAllocation(currentProfile.profileType)" class="space-y-1">
              <div class="flex justify-between text-xs font-semibold">
                <span>{{ asset.name }}</span>
                <span class="font-bold">{{ asset.pct }}%</span>
              </div>
              <div class="w-full bg-brand-bg rounded-full h-2 overflow-hidden border border-brand-border">
                <div [class]="asset.color" class="h-2 rounded-full transition-all duration-500" [style.width.%]="asset.pct"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button 
            (click)="startQuiz()" 
            class="px-6 py-2.5 bg-brand-primary-light hover:bg-brand-primary text-brand-primary-dark hover:text-white border border-brand-primary rounded-xl text-xs font-bold transition-all focus:outline-none"
          >
            Retake Risk Questionnaire
          </button>
        </div>
      </div>

      <!-- State: Taking Assessment Quiz -->
      <div *ngIf="!loading && takingTest" class="bg-white border border-brand-border p-8 rounded-2xl shadow-sm space-y-6">
        <div class="flex justify-between items-center border-b border-brand-border pb-4">
          <span class="text-xs font-bold text-text-sub uppercase tracking-wider">
            Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
          </span>
          <button (click)="cancelQuiz()" class="text-xs text-red-500 hover:underline">Cancel</button>
        </div>

        <div class="space-y-4">
          <h3 class="text-base font-bold text-text-main leading-snug">
            {{ questions[currentQuestionIndex].text }}
          </h3>

          <div class="space-y-2.5">
            <button 
              *ngFor="let opt of questions[currentQuestionIndex].options"
              (click)="selectOption(opt.score)"
              class="w-full p-4 rounded-xl border border-brand-border hover:border-brand-primary hover:bg-brand-bg text-left text-xs font-medium transition-all duration-150 flex items-center justify-between"
            >
              <span>{{ opt.text }}</span>
              <span class="text-text-sub opacity-50">➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RiskProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private riskProfileService = inject(RiskProfileService);

  loading = false;
  isDemoMode = true;
  showGuide = true;

  currentProfile: any = null;
  takingTest = false;
  currentQuestionIndex = 0;
  accumulatedScore = 0;
  userId = '';

  readonly demoProfile = {
    profileId: 'demo-rp-1',
    profileType: 'MODERATE_GROWTH',
    riskScore: 68
  };

  questions: Question[] = [
    {
      id: 1,
      text: 'What is your primary financial investment objective?',
      options: [
        { text: 'Capital preservation: I cannot afford to lose my money under any circumstance.', score: 5 },
        { text: 'Steady income: Modest returns with very minimal market fluctuations.', score: 15 },
        { text: 'Balanced growth: Moderate wealth creation with acceptable short-term fluctuations.', score: 25 },
        { text: 'Aggressive wealth accumulation: High long-term growth; short-term drops do not bother me.', score: 35 }
      ]
    },
    {
      id: 2,
      text: 'If your portfolio drops by 20% in a month due to market volatility, how would you react?',
      options: [
        { text: 'Sell everything immediately to prevent further bleeding.', score: 5 },
        { text: 'Feel anxious and move funds into bank fixed deposits.', score: 15 },
        { text: 'Hold tight and wait for normal market recovery.', score: 25 },
        { text: 'Invest more aggressively at cheaper discounted prices.', score: 35 }
      ]
    },
    {
      id: 3,
      text: 'What is your investment time horizon for major life goals?',
      options: [
        { text: 'Less than 1 year (Very Short Term)', score: 5 },
        { text: '1 to 3 years (Short Term)', score: 15 },
        { text: '3 to 7 years (Medium Term)', score: 25 },
        { text: 'More than 7 years (Long Term Growth)', score: 35 }
      ]
    }
  ];

  ngOnInit() {
    const session = this.authService.currentUser();
    this.userId = session ? session.userId : 'demo-user-id';

    this.applyDemoData();

    if (session) {
      this.loadProfile();
    }
  }

  toggleGuide() {
    this.showGuide = !this.showGuide;
  }

  setMode(demo: boolean) {
    this.isDemoMode = demo;
    if (demo) {
      this.applyDemoData();
    } else {
      this.applyLiveData();
    }
  }

  private applyDemoData() {
    this.currentProfile = { ...this.demoProfile };
    this.loading = false;
  }

  private applyLiveData() {
    this.currentProfile = null;
    this.loadProfile();
  }

  loadProfile() {
    this.riskProfileService.getRiskProfile(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          if (!this.isDemoMode) {
            this.currentProfile = res.data;
          }
        }
      },
      error: (err: any) => console.warn('Could not load live profile', err)
    });
  }

  getRecommendedAllocation(type: string): { name: string; pct: number; color: string }[] {
    switch (type) {
      case 'CONSERVATIVE':
        return [
          { name: 'Fixed Income & Bonds', pct: 60, color: 'bg-emerald-500' },
          { name: 'Equity Mutual Funds', pct: 20, color: 'bg-brand-primary' },
          { name: 'Sovereign Gold', pct: 10, color: 'bg-amber-400' },
          { name: 'Liquid Cash Buffer', pct: 10, color: 'bg-blue-400' }
        ];
      case 'AGGRESSIVE':
        return [
          { name: 'Direct Equity & Small Cap', pct: 60, color: 'bg-red-500' },
          { name: 'Flexi Cap Funds', pct: 25, color: 'bg-brand-primary' },
          { name: 'Debt & Bonds', pct: 10, color: 'bg-emerald-500' },
          { name: 'Cash Reserves', pct: 5, color: 'bg-blue-400' }
        ];
      default: // MODERATE / MODERATE_GROWTH
        return [
          { name: 'Diversified Equity Funds', pct: 50, color: 'bg-brand-primary' },
          { name: 'Fixed Deposits & Debt', pct: 30, color: 'bg-emerald-500' },
          { name: 'Gold ETFs', pct: 10, color: 'bg-amber-400' },
          { name: 'Liquid Cash & Savings', pct: 10, color: 'bg-blue-400' }
        ];
    }
  }

  startQuiz() {
    this.currentQuestionIndex = 0;
    this.accumulatedScore = 0;
    this.takingTest = true;
  }

  cancelQuiz() {
    this.takingTest = false;
  }

  selectOption(score: number) {
    this.accumulatedScore += score;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    let profileType = 'MODERATE';
    if (this.accumulatedScore <= 35) profileType = 'CONSERVATIVE';
    else if (this.accumulatedScore >= 80) profileType = 'AGGRESSIVE';

    if (this.isDemoMode) {
      this.currentProfile = {
        profileType: profileType,
        riskScore: Math.min(100, Math.round((this.accumulatedScore / 105) * 100))
      };
      this.takingTest = false;
      return;
    }

    const payload = {
      userId: this.userId,
      riskScore: Math.min(100, Math.round((this.accumulatedScore / 105) * 100)),
      profileType: profileType
    };

    this.riskProfileService.createRiskProfile(payload).subscribe({
      next: (res: any) => {
        this.currentProfile = res.data;
        this.takingTest = false;
      },
      error: (err: any) => {
        alert(err?.error?.message || 'Failed to calculate risk profile.');
        this.takingTest = false;
      }
    });
  }
}
