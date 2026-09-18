// Rule-based Scheme & Opportunity Eligibility Evaluator

const EDUCATION_LEVELS = {
  "Below 8th": 1,
  "8th Pass": 2,
  "10th Pass": 3,
  "12th Pass": 4,
  "ITI": 4,
  "Diploma": 5,
  "Graduate": 6,
  "Post Graduate": 7
};

function evaluateEligibility(user, scheme) {
  const criteria = scheme.eligibility || {};
  const reasons = [];
  let isEligible = true;
  let requiresVerification = false;

  // 1. Category Check
  if (criteria.category && criteria.category.length > 0) {
    const userCat = (user.category || '').toUpperCase();
    const matchedCat = criteria.category.map(c => c.toUpperCase()).includes(userCat);
    if (matchedCat) {
      reasons.push({
        rule: "Category Eligibility",
        passed: true,
        message: `Beneficiary category '${user.category}' qualifies for this scheme (Priority: Scheduled Caste).`
      });
    } else {
      reasons.push({
        rule: "Category Eligibility",
        passed: false,
        message: `Scheme is targeted to ${criteria.category.join(', ')}. Your profile category is ${user.category || 'Not specified'}.`
      });
      isEligible = false;
    }
  }

  // 2. Age Check
  const age = user.age || 0;
  if (criteria.min_age && criteria.max_age) {
    if (age >= criteria.min_age && age <= criteria.max_age) {
      reasons.push({
        rule: "Age Criteria",
        passed: true,
        message: `Current age (${age} yrs) is within the eligible range of ${criteria.min_age}-${criteria.max_age} years.`
      });
    } else {
      reasons.push({
        rule: "Age Criteria",
        passed: false,
        message: `Age (${age} yrs) must be between ${criteria.min_age} and ${criteria.max_age} years.`
      });
      isEligible = false;
    }
  }

  // 3. Income Check
  const income = user.annual_income !== undefined ? user.annual_income : 0;
  if (criteria.max_annual_income) {
    if (income <= criteria.max_annual_income) {
      reasons.push({
        rule: "Income Ceiling",
        passed: true,
        message: `Annual household income (₹${income.toLocaleString('en-IN')}) is below the ₹${criteria.max_annual_income.toLocaleString('en-IN')} ceiling.`
      });
    } else {
      reasons.push({
        rule: "Income Ceiling",
        passed: false,
        message: `Annual income (₹${income.toLocaleString('en-IN')}) exceeds scheme limit of ₹${criteria.max_annual_income.toLocaleString('en-IN')}.`
      });
      isEligible = false;
    }
  }

  // 4. Education Level Check
  if (criteria.min_education) {
    const userEdScore = EDUCATION_LEVELS[user.education] || 2;
    const requiredScore = EDUCATION_LEVELS[criteria.min_education] || 2;
    if (userEdScore >= requiredScore) {
      reasons.push({
        rule: "Educational Qualification",
        passed: true,
        message: `Educational qualification (${user.education}) satisfies requirement of ${criteria.min_education}.`
      });
    } else {
      reasons.push({
        rule: "Educational Qualification",
        passed: false,
        message: `Minimum required education is ${criteria.min_education}. Your profile states ${user.education || 'Unspecified'}.`
      });
      isEligible = false;
    }
  }

  // 5. Document verification check
  const docs = user.documents || [];
  const verifiedCaste = docs.some(d => d.type === 'caste_cert' && d.status === 'VERIFIED');
  const verifiedIncome = docs.some(d => d.type === 'income_cert' && d.status === 'VERIFIED');

  if (isEligible) {
    if (!verifiedCaste || !verifiedIncome) {
      requiresVerification = true;
      reasons.push({
        rule: "Document Status",
        passed: true,
        message: "Profile parameters match criteria; official Tehsildar caste/income documents are awaiting officer verification."
      });
    } else {
      reasons.push({
        rule: "Document Status",
        passed: true,
        message: "Mandatory certificates are already verified in your Digital Locker."
      });
    }
  }

  let finalStatus = "NOT_MATCHED";
  if (isEligible) {
    finalStatus = requiresVerification ? "REQUIRES_VERIFICATION" : "ELIGIBLE";
  }

  return {
    schemeId: scheme.id,
    schemeTitle: scheme.title,
    status: finalStatus,
    isEligible,
    requiresVerification,
    reasons,
    summary: isEligible
      ? (requiresVerification
          ? "You qualify based on entered profile details. Application will proceed upon document verification by District Officer."
          : "Full Match: You meet all verified criteria for this PM-AJAY / GIA scheme.")
      : "Some criteria do not match your current profile."
  };
}

module.exports = {
  evaluateEligibility,
  EDUCATION_LEVELS
};
