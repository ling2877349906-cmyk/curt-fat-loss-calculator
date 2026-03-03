App({
  globalData: {
    // 热量计算页数据
    calorieData: {
      gender: 'male',
      age: 22,
      height: 172,
      weight: 60,
      trainTime: 0,
      trainIntensity: 8,
      bmr: 0,
      trainCalories: 0,
      tdee: 0,
      nutritionMode: '532',
      customNutrition: {
        carbs: 50,
        protein: 30,
        fat: 20
      },
      nutrition: {
        carbs: 0,
        carbsGrams: 0,
        protein: 0,
        proteinGrams: 0,
        fat: 0,
        fatGrams: 0
      }
    },

    // 减脂预测页数据
    predictionData: {
      initialWeight: 60,
      targetWeight: 50,
      monthlyLossPercent: 3,
      totalLoss: 10,
      predictMonths: 0,
      predictWeeks: 0,
      predictDays: 0,
      monthlyLoss: 0,
      weeklyLoss: 0
    },

    // 个人页数据
    profileData: {
      bmi: 0,
      bmiStatus: '',
      currentWeight: 60,
      targetWeight: 50
    }
  },

  onLaunch() {
    this.loadData();
  },

  loadData() {
    const calorieData = wx.getStorageSync('calorieData');
    const predictionData = wx.getStorageSync('predictionData');
    const profileData = wx.getStorageSync('profileData');

    if (calorieData) this.globalData.calorieData = calorieData;
    if (predictionData) this.globalData.predictionData = predictionData;
    if (profileData) this.globalData.profileData = profileData;
  },

  saveData() {
    wx.setStorageSync('calorieData', this.globalData.calorieData);
    wx.setStorageSync('predictionData', this.globalData.predictionData);
    wx.setStorageSync('profileData', this.globalData.profileData);
  },

  // 计算BMR
  calculateBMR(gender, weight, height, age) {
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return Math.round(bmr);
  },

  // 计算训练热量
  calculateTrainCalories(trainTime, intensity) {
    return Math.round(trainTime * intensity);
  },

  // 计算TDEE
  calculateTDEE(bmr, trainCalories) {
    return bmr + trainCalories;
  },

  // 计算营养素
  calculateNutrition(tdee, mode, customNutrition) {
    let carbsPercent, proteinPercent, fatPercent;

    if (mode === '532') {
      carbsPercent = 50;
      proteinPercent = 30;
      fatPercent = 20;
    } else if (mode === '442') {
      carbsPercent = 40;
      proteinPercent = 40;
      fatPercent = 20;
    } else {
      carbsPercent = customNutrition.carbs;
      proteinPercent = customNutrition.protein;
      fatPercent = customNutrition.fat;
    }

    const carbsCalories = Math.round(tdee * carbsPercent / 100);
    const proteinCalories = Math.round(tdee * proteinPercent / 100);
    const fatCalories = Math.round(tdee * fatPercent / 100);

    const carbsGrams = Math.round(carbsCalories / 4);
    const proteinGrams = Math.round(proteinCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);

    return {
      carbs: carbsCalories,
      carbsGrams: carbsGrams,
      protein: proteinCalories,
      proteinGrams: proteinGrams,
      fat: fatCalories,
      fatGrams: fatGrams
    };
  },

  // 计算BMI
  calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    let status;

    if (bmi < 18.5) {
      status = '偏瘦';
    } else if (bmi >= 18.5 && bmi < 24) {
      status = '正常';
    } else {
      status = '偏胖';
    }

    return {
      bmi: parseFloat(bmi.toFixed(1)),
      status: status
    };
  },

  // 计算减脂周期
  calculatePrediction(initialWeight, targetWeight, monthlyLossPercent) {
    const totalLoss = parseFloat((initialWeight - targetWeight).toFixed(2));
    const monthlyLoss = parseFloat((initialWeight * monthlyLossPercent / 100).toFixed(2));
    const predictMonths = parseFloat((totalLoss / monthlyLoss).toFixed(2));
    
    const totalDays = Math.round(predictMonths * 30);
    const predictWeeks = Math.floor(totalDays / 7);
    const predictDays = totalDays % 7;
    
    const weeklyLoss = parseFloat((monthlyLoss / 4).toFixed(2));

    return {
      totalLoss: totalLoss,
      monthlyLoss: monthlyLoss,
      predictMonths: predictMonths,
      predictWeeks: predictWeeks,
      predictDays: predictDays,
      weeklyLoss: weeklyLoss
    };
  }
});
