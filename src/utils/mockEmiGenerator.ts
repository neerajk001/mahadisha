import { LoanRequest, EMISchedule } from '../types';

export const generateMockEmiSchedule = (request: LoanRequest): EMISchedule[] => {
  const schedules: EMISchedule[] = [];
  const loanAmount = request.loanAmount;
  const annualInterestRate = request.interestRate / 100;
  const loanTermMonths = request.loanTerm * 12;
  
  // Calculate EMI using standard formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyInterestRate = annualInterestRate / 12;
  const emi = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / 
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
  
  let outstandingBalance = loanAmount;
  const startDate = new Date(request.applicationDate);
  
  // Mock payment status - assume some payments made, some overdue, some pending
  const paidCount = Math.floor(loanTermMonths * 0.25); // 25% paid
  const overdueCount = Math.floor(loanTermMonths * 0.1); // 10% overdue
  
  for (let i = 0; i < loanTermMonths; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    
    // Calculate interest and principal components
    const interestComponent = outstandingBalance * monthlyInterestRate;
    const principalComponent = emi - interestComponent;
    
    // Determine payment status
    let status: 'Paid' | 'Unpaid' | 'Overdue';
    let remarks = '';
    let penalty = 0;
    
    if (i < paidCount) {
      status = 'Paid';
      remarks = `Payment received on ${new Date(dueDate.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}`;
      outstandingBalance = Math.max(0, outstandingBalance - principalComponent);
    } else if (i < paidCount + overdueCount) {
      status = 'Overdue';
      const daysOverdue = Math.floor(Math.random() * 60) + 1;
      penalty = emi * 0.02 * Math.ceil(daysOverdue / 30); // 2% penalty per month
      remarks = `Payment overdue by ${daysOverdue} days`;
    } else {
      status = 'Unpaid';
      remarks = dueDate > new Date() ? 'Payment not yet due' : 'Payment pending';
      if (dueDate <= new Date()) {
        status = 'Overdue';
        const daysOverdue = Math.ceil((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        penalty = emi * 0.02 * Math.ceil(daysOverdue / 30);
        remarks = `Payment overdue by ${daysOverdue} days`;
      }
    }
    
    schedules.push({
      id: `emi-${request.id}-${String(i + 1).padStart(3, '0')}`,
      dueDate: dueDate.toISOString(),
      emiAmount: Math.round(emi * 100) / 100,
      interest: Math.round(interestComponent * 100) / 100,
      principal: Math.round(principalComponent * 100) / 100,
      balance: Math.round(outstandingBalance * 100) / 100,
      penalty: Math.round(penalty * 100) / 100,
      status,
      remarks
    });
    
    // Only reduce outstanding balance if payment was made
    if (status === 'Paid') {
      outstandingBalance = Math.max(0, outstandingBalance - principalComponent);
    }
  }
  
  return schedules;
};

// Helper function to calculate total paid, pending, and overdue amounts
export const calculateRepaymentSummary = (schedule: EMISchedule[]) => {
  const summary = {
    totalEMIs: schedule.length,
    paidEMIs: schedule.filter(emi => emi.status === 'Paid').length,
    overdueEMIs: schedule.filter(emi => emi.status === 'Overdue').length,
    unpaidEMIs: schedule.filter(emi => emi.status === 'Unpaid').length,
    totalPaidAmount: 0,
    totalOverdueAmount: 0,
    totalPendingAmount: 0,
    totalPenalty: 0
  };
  
  schedule.forEach(emi => {
    switch (emi.status) {
      case 'Paid':
        summary.totalPaidAmount += emi.emiAmount;
        break;
      case 'Overdue':
        summary.totalOverdueAmount += emi.emiAmount;
        summary.totalPenalty += emi.penalty;
        break;
      case 'Unpaid':
        summary.totalPendingAmount += emi.emiAmount;
        break;
    }
  });
  
  return {
    ...summary,
    totalPaidAmount: Math.round(summary.totalPaidAmount * 100) / 100,
    totalOverdueAmount: Math.round(summary.totalOverdueAmount * 100) / 100,
    totalPendingAmount: Math.round(summary.totalPendingAmount * 100) / 100,
    totalPenalty: Math.round(summary.totalPenalty * 100) / 100
  };
};
