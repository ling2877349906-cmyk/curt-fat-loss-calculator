App({
  globalData: {
    // 热量计算页数据
    gender: 'male', // male 或 female
    age: 22,
    height: 172, // cm
    weight: 60, // kg
    trainingTime: 0, // 分钟
    trainingIntensity: 8, // 系数: 5(新手), 8(爱好者), 10(老手)
    
    // 营养素比例
    nutritionRatio: '532', // '532', '442', 'custom'
    customRatio: {
      carbs: 50,
      protein: 30,
      fat: 20
    },
    
    // 减脂预测页数据
    initialWeight: 60, // kg
    targetWeight: 50, // kg
    monthlyLossRatio: 3, // %
    
    // 计算结果缓存
    bmr: 0,
    tdee: 0,
    bmi: 0,
    bmiStatus: '正常'
  },

  onLaunch() {
    // 计算初始值
    this.calculateBMR();
    this.calculateBMI();
  },

  // 计算基础代谢率 (BMR)
  calculateBMR() {
    const { gender, weight, height, age } = this.globalData;
    let bmr;
    
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    this.globalData.bmr = Math.round(bmr);
    return this.globalData.bmr;
  },

  // 计算每日总热量消耗 (TDEE)
  calculateTDEE() {
    const { trainingTime, trainingIntensity } = this.globalData;
    const trainingCalories = trainingTime * trainingIntensity;
    this.globalData.tdee = this.globalData.bmr + trainingCalories;
    return this.globalData.tdee;
  },

  // 计算BMI
  calculateBMI() {
    const { weight, height } = this.globalData;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    this.globalData.bmi = parseFloat(bmi.toFixed(1));
    
    // 判断BMI状态
    if (bmi < 18.5) {
      this.globalData.bmiStatus = '偏瘦';
    } else if (bmi >= 18.5 && bmi < 24) {
      this.globalData.bmiStatus = '正常';
    } else if (bmi >= 24 && bmi < 28) {
      this.globalData.bmiStatus = '偏胖';
    } else {
      this.globalData.bmiStatus = '肥胖';
    }
    
    return this.globalData.bmi;
  },

  // 获取营养素分配
  getNutritionBreakdown() {
    const tdee = this.calculateTDEE();
    let carbs, protein, fat;
    
    const ratio = this.globalData.nutritionRatio;
    let carbsPercent, proteinPercent, fatPercent;
    
    if (ratio === '532') {
      carbsPercent = 50;
      proteinPercent = 30;
      fatPercent = 20;
    } else if (ratio === '442') {
      carbsPercent = 40;
      proteinPercent = 40;
      fatPercent = 20;
    } else {
      const custom = this.globalData.customRatio;
      carbsPercent = custom.carbs;
      proteinPercent = custom.protein;
      fatPercent = custom.fat;
    }
    
    // 计算克数
    carbs = Math.round((tdee * carbsPercent / 100) / 4);
    protein = Math.round((tdee * proteinPercent / 100) / 4);
    fat = Math.round((tdee * fatPercent / 100) / 9);
    
    // 计算热量
    const carbsCalories = Math.round(carbs * 4);
    const proteinCalories = Math.round(protein * 4);
    const fatCalories = Math.round(fat * 9);
    
    return {
      carbs: { grams: carbs, calories: carbsCalories, percent: carbsPercent },
      protein: { grams: protein, calories: proteinCalories, percent: proteinPercent },
      fat: { grams: fat, calories: fatCalories, percent: fatPercent }
    };
  },

  // 计算减脂预测
  calculateFatLossPrediction() {
    const { initialWeight, targetWeight, monthlyLossRatio } = this.globalData;
    const totalLoss = initialWeight - targetWeight;
    const monthlyLoss = initialWeight * (monthlyLossRatio / 100);
    const months = totalLoss / monthlyLoss;
    const days = months * 30;
    const weeks = Math.floor(days / 7);
    const remainingDays = Math.round(days % 7);
    
    return {
      totalLoss: parseFloat(totalLoss.toFixed(2)),
      months: parseFloat(months.toFixed(2)),
      weeks: weeks,
      days: remainingDays,
      monthlyLoss: parseFloat(monthlyLoss.toFixed(2)),
      weeklyLoss: parseFloat((monthlyLoss / 4).toFixed(2))
    };
  }
});
