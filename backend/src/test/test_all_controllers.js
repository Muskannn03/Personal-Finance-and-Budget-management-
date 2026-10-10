const BASE_URL = 'http://localhost:8080/api/v1';

async function req(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${BASE_URL}${path}`, options);
  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, json };
}

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}: ${details}`);
    failed++;
  }
}

async function runAllTests() {
  console.log('=== RUNNING COMPREHENSIVE CONTROLLER TEST SUITE ===\n');
  const timestamp = Date.now();
  const testEmail = `suite_${timestamp}@example.com`;

  // 1. AUTH CONTROLLER
  console.log('1. Testing AuthController (POST)...');
  const regRes = await req('POST', '/auth/register', {
    name: 'Suite User',
    email: testEmail,
    password: 'Password@123',
    currencyPreference: 'INR'
  });
  assert(regRes.status === 201 || regRes.status === 200, 'POST /auth/register', JSON.stringify(regRes.json));
  const testUserId = regRes.json?.data?.userId;

  const loginRes = await req('POST', '/auth/login', {
    email: testEmail,
    password: 'Password@123'
  });
  assert(loginRes.status === 200, 'POST /auth/login', JSON.stringify(loginRes.json));
  const token = loginRes.json?.data?.accessToken;

  // 2. USER CONTROLLER
  console.log('\n2. Testing UserController (GET, PUT, DELETE)...');
  const getUserRes = await req('GET', `/users/${testUserId}`, null, token);
  assert(getUserRes.status === 200, 'GET /users/{id}', JSON.stringify(getUserRes.json));

  const getAllUsersRes = await req('GET', '/users?page=0&size=10', null, token);
  assert(getAllUsersRes.status === 200, 'GET /users (pageable)', JSON.stringify(getAllUsersRes.json));

  const putUserRes = await req('PUT', `/users/${testUserId}`, {
    name: 'Suite User Updated',
    email: testEmail,
    currencyPreference: 'INR',
    role: 'USER'
  }, token);
  assert(putUserRes.status === 200, 'PUT /users/{id}', JSON.stringify(putUserRes.json));

  // 3. ACCOUNT CONTROLLER
  console.log('\n3. Testing AccountController (POST, GET, PUT, DELETE)...');
  const postAccRes = await req('POST', '/accounts', {
    userId: testUserId,
    accountName: 'Suite Test Bank',
    accountType: 'SAVINGS',
    balance: 5000.00
  }, token);
  assert(postAccRes.status === 201, 'POST /accounts', JSON.stringify(postAccRes.json));
  const testAccountId = postAccRes.json?.data?.accountId;

  const getAccRes = await req('GET', `/accounts/${testAccountId}`, null, token);
  assert(getAccRes.status === 200, 'GET /accounts/{id}', JSON.stringify(getAccRes.json));

  const getUserAccsRes = await req('GET', `/accounts/user/${testUserId}`, null, token);
  assert(getUserAccsRes.status === 200, 'GET /accounts/user/{userId}', JSON.stringify(getUserAccsRes.json));

  const putAccRes = await req('PUT', `/accounts/${testAccountId}`, {
    accountName: 'Suite Test Bank Updated',
    accountType: 'SAVINGS',
    balance: 6000.00
  }, token);
  assert(putAccRes.status === 200, 'PUT /accounts/{id}', JSON.stringify(putAccRes.json));

  // 4. CATEGORY CONTROLLER
  console.log('\n4. Testing CategoryController (POST, GET, PUT, DELETE)...');
  const postCatRes = await req('POST', '/categories', {
    userId: testUserId,
    categoryName: `SuiteCat_${timestamp}`,
    type: 'EXPENSE'
  }, token);
  assert(postCatRes.status === 201, 'POST /categories', JSON.stringify(postCatRes.json));
  const testCatId = postCatRes.json?.data?.categoryId;

  const getCatRes = await req('GET', `/categories/${testCatId}`, null, token);
  assert(getCatRes.status === 200, 'GET /categories/{id}', JSON.stringify(getCatRes.json));

  const getUserCatsRes = await req('GET', `/categories/user/${testUserId}`, null, token);
  assert(getUserCatsRes.status === 200, 'GET /categories/user/{userId}', JSON.stringify(getUserCatsRes.json));

  const putCatRes = await req('PUT', `/categories/${testCatId}`, {
    categoryName: `SuiteCatUpdated_${timestamp}`,
    type: 'EXPENSE'
  }, token);
  assert(putCatRes.status === 200, 'PUT /categories/{id}', JSON.stringify(putCatRes.json));

  // 5. TRANSACTION CONTROLLER
  console.log('\n5. Testing TransactionController (POST, GET, PUT, DELETE)...');
  const postTxRes = await req('POST', '/transactions', {
    userId: testUserId,
    accountId: testAccountId,
    categoryId: testCatId,
    amount: 150.00,
    type: 'EXPENSE'
  }, token);
  assert(postTxRes.status === 201, 'POST /transactions', JSON.stringify(postTxRes.json));
  const testTxId = postTxRes.json?.data?.transactionId;

  const getTxRes = await req('GET', `/transactions/${testTxId}`, null, token);
  assert(getTxRes.status === 200, 'GET /transactions/{id}', JSON.stringify(getTxRes.json));

  const getTxPageRes = await req('GET', `/transactions?userId=${testUserId}`, null, token);
  assert(getTxPageRes.status === 200, 'GET /transactions?userId={userId}', JSON.stringify(getTxPageRes.json));

  const putTxRes = await req('PUT', `/transactions/${testTxId}`, {
    accountId: testAccountId,
    categoryId: testCatId,
    amount: 200.00,
    type: 'EXPENSE'
  }, token);
  assert(putTxRes.status === 200, 'PUT /transactions/{id}', JSON.stringify(putTxRes.json));

  // 6. BUDGET CONTROLLER
  console.log('\n6. Testing BudgetController (POST, GET, PUT, DELETE)...');
  const postBudgetRes = await req('POST', '/budgets', {
    userId: testUserId,
    categoryId: testCatId,
    limitAmount: 5000.00,
    period: 'MONTHLY',
    startDate: '2026-09-01',
    endDate: '2026-09-30'
  }, token);
  assert(postBudgetRes.status === 201, 'POST /budgets', JSON.stringify(postBudgetRes.json));
  const testBudgetId = postBudgetRes.json?.data?.budgetId;

  const getBudgetRes = await req('GET', `/budgets/${testBudgetId}`, null, token);
  assert(getBudgetRes.status === 200, 'GET /budgets/{id}', JSON.stringify(getBudgetRes.json));

  const getUserBudgetsRes = await req('GET', `/budgets/user/${testUserId}`, null, token);
  assert(getUserBudgetsRes.status === 200, 'GET /budgets/user/{userId}', JSON.stringify(getUserBudgetsRes.json));

  const putBudgetRes = await req('PUT', `/budgets/${testBudgetId}`, {
    categoryId: testCatId,
    limitAmount: 6000.00,
    period: 'MONTHLY',
    startDate: '2026-09-01',
    endDate: '2026-09-30'
  }, token);
  assert(putBudgetRes.status === 200, 'PUT /budgets/{id}', JSON.stringify(putBudgetRes.json));

  // 7. GOAL CONTROLLER
  console.log('\n7. Testing GoalController (POST, GET, PUT, DELETE)...');
  const postGoalRes = await req('POST', '/goals', {
    userId: testUserId,
    goalName: 'Suite Goal Vacation',
    targetAmount: 30000.00,
    targetDate: '2027-01-01'
  }, token);
  assert(postGoalRes.status === 201, 'POST /goals', JSON.stringify(postGoalRes.json));
  const testGoalId = postGoalRes.json?.data?.goalId;

  const getGoalRes = await req('GET', `/goals/${testGoalId}`, null, token);
  assert(getGoalRes.status === 200, 'GET /goals/{id}', JSON.stringify(getGoalRes.json));

  const getUserGoalsRes = await req('GET', `/goals/user/${testUserId}`, null, token);
  assert(getUserGoalsRes.status === 200, 'GET /goals/user/{userId}', JSON.stringify(getUserGoalsRes.json));

  const putGoalRes = await req('PUT', `/goals/${testGoalId}`, {
    goalName: 'Suite Goal Vacation Updated',
    targetAmount: 35000.00,
    targetDate: '2027-02-01',
    status: 'IN_PROGRESS'
  }, token);
  assert(putGoalRes.status === 200, 'PUT /goals/{id}', JSON.stringify(putGoalRes.json));

  // 8. INVESTMENT CONTROLLER
  console.log('\n8. Testing InvestmentController (POST, GET, PUT, DELETE)...');
  const postInvRes = await req('POST', '/investments', {
    userId: testUserId,
    goalId: testGoalId,
    type: 'MUTUAL_FUND',
    amount: 10000.00,
    startDate: '2026-09-11',
    maturityDate: '2028-09-11',
    currentValue: 10500.00
  }, token);
  assert(postInvRes.status === 201, 'POST /investments', JSON.stringify(postInvRes.json));
  const testInvId = postInvRes.json?.data?.investmentId;

  const getInvRes = await req('GET', `/investments/${testInvId}`, null, token);
  assert(getInvRes.status === 200, 'GET /investments/{id}', JSON.stringify(getInvRes.json));

  const getUserInvsPathRes = await req('GET', `/investments/user/${testUserId}`, null, token);
  assert(getUserInvsPathRes.status === 200, 'GET /investments/user/{userId}', JSON.stringify(getUserInvsPathRes.json));

  const getUserInvsQueryRes = await req('GET', `/investments?userId=${testUserId}`, null, token);
  assert(getUserInvsQueryRes.status === 200, 'GET /investments?userId={userId}', JSON.stringify(getUserInvsQueryRes.json));

  const putInvRes = await req('PUT', `/investments/${testInvId}`, {
    goalId: testGoalId,
    type: 'MUTUAL_FUND',
    amount: 10000.00,
    startDate: '2026-09-11',
    maturityDate: '2028-09-11',
    currentValue: 11000.00
  }, token);
  assert(putInvRes.status === 200, 'PUT /investments/{id}', JSON.stringify(putInvRes.json));

  // 9. REMINDER CONTROLLER
  console.log('\n9. Testing ReminderController (POST, GET, PUT, DELETE)...');
  const postRemRes = await req('POST', '/reminders', {
    userId: testUserId,
    title: 'Pay Suite Card Bill',
    relatedType: 'BUDGET',
    relatedId: testBudgetId,
    dueDate: '2026-09-25T10:00:00',
    status: 'PENDING'
  }, token);
  assert(postRemRes.status === 201, 'POST /reminders', JSON.stringify(postRemRes.json));
  const testRemId = postRemRes.json?.data?.reminderId;

  const getRemRes = await req('GET', `/reminders/${testRemId}`, null, token);
  assert(getRemRes.status === 200, 'GET /reminders/{id}', JSON.stringify(getRemRes.json));

  const getUserRemsRes = await req('GET', `/reminders/user/${testUserId}`, null, token);
  assert(getUserRemsRes.status === 200, 'GET /reminders/user/{userId}', JSON.stringify(getUserRemsRes.json));

  const putRemRes = await req('PUT', `/reminders/${testRemId}`, {
    title: 'Pay Suite Card Bill Updated',
    relatedType: 'BUDGET',
    relatedId: testBudgetId,
    dueDate: '2026-09-26T10:00:00',
    status: 'COMPLETED'
  }, token);
  assert(putRemRes.status === 200, 'PUT /reminders/{id}', JSON.stringify(putRemRes.json));

  // 10. REWARD CONTROLLER
  console.log('\n10. Testing RewardController (POST, GET, PUT, DELETE)...');
  const postRewRes = await req('POST', '/rewards', {
    userId: testUserId,
    accountId: testAccountId,
    rewardType: 'CASHBACK_1_PERCENT',
    amount: 25.00,
    status: 'EARNED'
  }, token);
  assert(postRewRes.status === 201, 'POST /rewards', JSON.stringify(postRewRes.json));
  const testRewId = postRewRes.json?.data?.rewardId;

  const getRewRes = await req('GET', `/rewards/${testRewId}`, null, token);
  assert(getRewRes.status === 200, 'GET /rewards/{id}', JSON.stringify(getRewRes.json));

  const getUserRewsRes = await req('GET', `/rewards/user/${testUserId}`, null, token);
  assert(getUserRewsRes.status === 200, 'GET /rewards/user/{userId}', JSON.stringify(getUserRewsRes.json));

  const putRewRes = await req('PUT', `/rewards/${testRewId}`, {
    accountId: testAccountId,
    rewardType: 'CASHBACK_1_PERCENT',
    amount: 25.00,
    status: 'REDEEMED'
  }, token);
  assert(putRewRes.status === 200, 'PUT /rewards/{id}', JSON.stringify(putRewRes.json));

  // 11. RISK PROFILE CONTROLLER
  console.log('\n11. Testing RiskProfileController (POST, GET, PUT, DELETE)...');
  const postRiskRes = await req('POST', '/risk-profiles', {
    userId: testUserId,
    riskScore: 65,
    profileType: 'MODERATE'
  }, token);
  assert(postRiskRes.status === 201, 'POST /risk-profiles', JSON.stringify(postRiskRes.json));
  const testRiskId = postRiskRes.json?.data?.profileId;

  const getRiskRes = await req('GET', `/risk-profiles/${testRiskId}`, null, token);
  assert(getRiskRes.status === 200, 'GET /risk-profiles/{id}', JSON.stringify(getRiskRes.json));

  const getUserRiskRes = await req('GET', `/risk-profiles/user/${testUserId}`, null, token);
  assert(getUserRiskRes.status === 200, 'GET /risk-profiles/user/{userId}', JSON.stringify(getUserRiskRes.json));

  const putRiskRes = await req('PUT', `/risk-profiles/${testRiskId}`, {
    riskScore: 75,
    profileType: 'AGGRESSIVE'
  }, token);
  assert(putRiskRes.status === 200, 'PUT /risk-profiles/{id}', JSON.stringify(putRiskRes.json));

  // 12. REPORT CONTROLLER
  console.log('\n12. Testing ReportController (GET)...');
  const repDash = await req('GET', `/reports/dashboard?userId=${testUserId}`, null, token);
  assert(repDash.status === 200, 'GET /reports/dashboard?userId={userId}', JSON.stringify(repDash.json));

  const repSpend = await req('GET', `/reports/spending?userId=${testUserId}&startDate=2026-01-01&endDate=2026-12-31`, null, token);
  assert(repSpend.status === 200, 'GET /reports/spending', JSON.stringify(repSpend.json));

  const repUtil = await req('GET', `/reports/budget-utilization?userId=${testUserId}`, null, token);
  assert(repUtil.status === 200, 'GET /reports/budget-utilization', JSON.stringify(repUtil.json));

  const repTrend = await req('GET', `/reports/monthly-trend?userId=${testUserId}`, null, token);
  assert(repTrend.status === 200, 'GET /reports/monthly-trend', JSON.stringify(repTrend.json));

  const repRewards = await req('GET', `/reports/rewards-summary?userId=${testUserId}`, null, token);
  assert(repRewards.status === 200, 'GET /reports/rewards-summary', JSON.stringify(repRewards.json));

  // DELETES
  console.log('\n=== Testing DELETE Operations ===');
  const delTx = await req('DELETE', `/transactions/${testTxId}`, null, token);
  assert(delTx.status === 200, 'DELETE /transactions/{id}');

  const delRem = await req('DELETE', `/reminders/${testRemId}`, null, token);
  assert(delRem.status === 200, 'DELETE /reminders/{id}');

  const delRew = await req('DELETE', `/rewards/${testRewId}`, null, token);
  assert(delRew.status === 200, 'DELETE /rewards/{id}');

  const delInv = await req('DELETE', `/investments/${testInvId}`, null, token);
  assert(delInv.status === 200, 'DELETE /investments/{id}');

  const delBudget = await req('DELETE', `/budgets/${testBudgetId}`, null, token);
  assert(delBudget.status === 200, 'DELETE /budgets/{id}');

  const delGoal = await req('DELETE', `/goals/${testGoalId}`, null, token);
  assert(delGoal.status === 200, 'DELETE /goals/{id}');

  const delCat = await req('DELETE', `/categories/${testCatId}`, null, token);
  assert(delCat.status === 200, 'DELETE /categories/{id}');

  const delAcc = await req('DELETE', `/accounts/${testAccountId}`, null, token);
  assert(delAcc.status === 200, 'DELETE /accounts/{id}');

  const delRisk = await req('DELETE', `/risk-profiles/${testRiskId}`, null, token);
  assert(delRisk.status === 200, 'DELETE /risk-profiles/{id}');

  const delUser = await req('DELETE', `/users/${testUserId}`, null, token);
  assert(delUser.status === 200, 'DELETE /users/{id}');

  console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
