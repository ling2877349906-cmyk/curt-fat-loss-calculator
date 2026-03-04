App({
  globalData: {
    // 热量计算页数据
    calorieData: {
      gender: null,
      age: null,
      height: null,
      weight: null,
      trainTime: null,
      trainIntensity: null,
      bmr: null,
      trainCalories: null,
      tdee: null,
      nutritionMode: null,
      customNutrition: {
        carbs: null,
        protein: null,
        fat: null
      },
      nutrition: {
        carbs: 0,
        carbsGrams: 0,
        protein: 0,
        proteinGrams: 0,
        fat: 0,
        fatGrams: 0,
        // 减脂模式的第4天数据
        carbsDay4: 0,
        carbsGramsDay4: 0,
        proteinDay4: 0,
        proteinGramsDay4: 0,
        fatDay4: 0,
        fatGramsDay4: 0
      }
    },

    // 减脂预测页数据
    predictionData: {
      initialWeight: null,
      targetWeight: null,
      monthlyLossPercent: null,
      totalLoss: 0,
      predictMonths: 0,
      predictWeeks: 0,
      predictDays: 0,
      monthlyLoss: 0,
      weeklyLoss: 0
    },

    // 个人页数据
    profileData: {
      bmi: null,
      bmiStatus: '',
      currentWeight: null,
      targetWeight: null
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

  // 计算BMR - 使用Mifflin-St Jeor公式（更准确）
  calculateBMR(gender, weight, height, age) {
    if (!gender || !weight || !height || !age) return null;
    
    let bmr;
    if (gender === 'male') {
      // 男性: 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 + 5
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      // 女性: 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 - 161
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // BMR不能为负数
    return Math.max(0, Math.round(bmr));
  },

  // 计算训练热量 - 修正公式
  // 训练热量 = 训练时间(分钟) × 系数
  // 系数的含义：每分钟消耗的热量
  // 新手(5): 每分钟消耗约5千卡
  // 爱好者(8): 每分钟消耗约8千卡  
  // 老手(10): 每分钟消耗约10千卡
  calculateTrainCalories(trainTime, intensity) {
    if (!trainTime || !intensity) return 0;
    // trainTime是分钟，intensity是系数
    return Math.round(trainTime * intensity);
  },

  // 计算TDEE - 总每日能量消耗
  // TDEE = BMR + 训练热量
  calculateTDEE(bmr, trainCalories) {
    if (!bmr) return null;
    return Math.max(0, bmr + (trainCalories || 0));
  },

  // 计算营养素 - 增肌模式
  calculateBulkNutrition(tdee, weight) {
    if (!tdee || !weight) return null;
    
    // 增肌模式：碳水体重*4g, 蛋白质体重*1.9g, 脂肪体重*0.8g
    const carbsGrams = Math.round(weight * 4);
    const proteinGrams = Math.round(weight * 1.9);
    const fatGrams = Math.round(weight * 0.8);

    // 热量计算：碳水和蛋白质每克4千卡，脂肪每克9千卡
    const carbsCalories = Math.round(carbsGrams * 4);
    const proteinCalories = Math.round(proteinGrams * 4);
    const fatCalories = Math.round(fatGrams * 9);

    return {
      carbs: carbsCalories,
      carbsGrams: carbsGrams,
      protein: proteinCalories,
      proteinGrams: proteinGrams,
      fat: fatCalories,
      fatGrams: fatGrams,
      carbsDay4: 0,
      carbsGramsDay4: 0,
      proteinDay4: 0,
      proteinGramsDay4: 0,
      fatDay4: 0,
      fatGramsDay4: 0
    };
  },

  // 计算营养素 - 减脂模式
  calculateCutNutrition(tdee, weight) {
    if (!tdee || !weight) return null;
    
    // 减脂模式前3天：碳水体重*1.5g, 蛋白质体重*1.4g, 脂肪体重*1g
    const carbsGrams = Math.round(weight * 1.5);
    const proteinGrams = Math.round(weight * 1.4);
    const fatGrams = Math.round(weight * 1);

    const carbsCalories = Math.round(carbsGrams * 4);
    const proteinCalories = Math.round(proteinGrams * 4);
    const fatCalories = Math.round(fatGrams * 9);

    // 减脂模式第4天：碳水体重*4g, 蛋白质体重*1.4g, 脂肪体重*0.5g
    const carbsGramsDay4 = Math.round(weight * 4);
    const proteinGramsDay4 = Math.round(weight * 1.4);
    const fatGramsDay4 = Math.round(weight * 0.5);

    const carbsCaloriesDay4 = Math.round(carbsGramsDay4 * 4);
    const proteinCaloriesDay4 = Math.round(proteinGramsDay4 * 4);
    const fatCaloriesDay4 = Math.round(fatGramsDay4 * 9);

    return {
      carbs: carbsCalories,
      carbsGrams: carbsGrams,
      protein: proteinCalories,
      proteinGrams: proteinGrams,
      fat: fatCalories,
      fatGrams: fatGrams,
      carbsDay4: carbsCaloriesDay4,
      carbsGramsDay4: carbsGramsDay4,
      proteinDay4: proteinCaloriesDay4,
      proteinGramsDay4: proteinGramsDay4,
      fatDay4: fatCaloriesDay4,
      fatGramsDay4: fatGramsDay4
    };
  },

  // 计算营养素 - 自定义模式
  calculateCustomNutrition(tdee, customNutrition) {
    if (!tdee || !customNutrition.carbs || !customNutrition.protein || !customNutrition.fat) return null;

    const carbsCalories = Math.round(customNutrition.carbs);
    const proteinCalories = Math.round(customNutrition.protein);
    const fatCalories = Math.round(customNutrition.fat);

    const carbsGrams = Math.round(carbsCalories / 4);
    const proteinGrams = Math.round(proteinCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);

    return {
      carbs: carbsCalories,
      carbsGrams: carbsGrams,
      protein: proteinCalories,
      proteinGrams: proteinGrams,
      fat: fatCalories,
      fatGrams: fatGrams,
      carbsDay4: 0,
      carbsGramsDay4: 0,
      proteinDay4: 0,
      proteinGramsDay4: 0,
      fatDay4: 0,
      fatGramsDay4: 0
    };
  },

  // 计算BMI
  calculateBMI(weight, height) {
    if (!weight || !height) return null;
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
    if (!initialWeight || !targetWeight || !monthlyLossPercent) return null;
    
    const totalLoss = parseFloat((initialWeight - targetWeight).toFixed(2));
    
    // 每月减重量 = 初始体重 × 每月减重比例
    const monthlyLoss = parseFloat((initialWeight * monthlyLossPercent / 100).toFixed(2));
    
    // 预计月份 = 总减重 ÷ 每月减重量
    const predictMonths = parseFloat((totalLoss / monthlyLoss).toFixed(2));
    
    // 转换为周和天
    const totalDays = Math.round(predictMonths * 30);
    const predictWeeks = Math.floor(totalDays / 7);
    const predictDays = totalDays % 7;
    
    // 每周减重 = 每月减重 ÷ 4
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
