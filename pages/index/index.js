Page({
  data: {
    // 用户信息
    userInfo: {
      age: null,
      height: null,
      weight: null,
      gender: 'male'
    },

    // 运动信息
    exercise: {
      aerobicTime: 0,
      anaerobicTime: 0,
      aerobicCalories: 0,
      anaerobicCalories: 0
    },

    // 饮食模式
    dietMode: 'bulk',
    customNutrition: {
      carbs: null,
      protein: null,
      fat: null
    },

    // 计算结果
    results: {
      bmr: 0,
      tdee: 0,
      bmi: 0,
      bmiStatus: '',
      nutrition: { carbs: 0, protein: 0, fat: 0 },
      nutritionDay4: { carbs: 0, protein: 0, fat: 0 }
    },

    // 体重记录
    weightRecords: [],
    targetWeight: null,
    currentWeight: null,

    // UI状态
    showUserInfoModal: false,
    showExerciseModal: false,
    showDietModal: false,
    showWeightModal: false,
    tempWeight: null,
    tempTargetWeight: null
  },

  onLoad() {
    const app = getApp();
    
    // 从全局数据加载
    this.setData({
      userInfo: app.globalData.userInfo,
      exercise: app.globalData.exercise,
      dietMode: app.globalData.dietMode,
      customNutrition: app.globalData.customNutrition,
      results: app.globalData.results,
      weightRecords: app.globalData.weightRecords,
      targetWeight: app.globalData.targetWeight,
      currentWeight: app.globalData.currentWeight
    });

    this.calculateAll();
  },

  onShow() {
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo,
      exercise: app.globalData.exercise,
      dietMode: app.globalData.dietMode,
      customNutrition: app.globalData.customNutrition,
      results: app.globalData.results,
      weightRecords: app.globalData.weightRecords,
      targetWeight: app.globalData.targetWeight,
      currentWeight: app.globalData.currentWeight
    });
  },

  // ==================== 个人信息模态框 ====================
  openUserInfoModal() {
    this.setData({ showUserInfoModal: true });
  },

  closeUserInfoModal() {
    this.setData({ showUserInfoModal: false });
  },

  onAgeInput(e) {
    let age = parseInt(e.detail.value) || null;
    if (age !== null) {
      age = Math.max(15, Math.min(100, age));
    }
    const userInfo = this.data.userInfo;
    userInfo.age = age;
    this.setData({ userInfo });
  },

  onHeightInput(e) {
    let height = parseInt(e.detail.value) || null;
    if (height !== null) {
      height = Math.max(100, Math.min(300, height));
    }
    const userInfo = this.data.userInfo;
    userInfo.height = height;
    this.setData({ userInfo });
  },

  onWeightInput(e) {
    let weight = parseInt(e.detail.value) || null;
    if (weight !== null) {
      weight = Math.max(30, Math.min(200, weight));
    }
    const userInfo = this.data.userInfo;
    userInfo.weight = weight;
    this.setData({ userInfo });
  },

  onGenderChange(e) {
    const gender = e.currentTarget.dataset.gender;
    const userInfo = this.data.userInfo;
    userInfo.gender = gender;
    this.setData({ userInfo });
  },

  saveUserInfo() {
    const { age, height, weight } = this.data.userInfo;
    
    if (age === null || height === null || weight === null) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const app = getApp();
    app.globalData.userInfo = this.data.userInfo;
    app.saveData();

    this.calculateAll();
    this.closeUserInfoModal();

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });
  },

  // ==================== 运动信息模态框 ====================
  openExerciseModal() {
    this.setData({ showExerciseModal: true });
  },

  closeExerciseModal() {
    this.setData({ showExerciseModal: false });
  },

  onAerobicTimeInput(e) {
    let time = parseInt(e.detail.value) || 0;
    time = Math.max(0, Math.min(300, time));
    const exercise = this.data.exercise;
    exercise.aerobicTime = time;
    this.setData({ exercise });
  },

  onAnaerobicTimeInput(e) {
    let time = parseInt(e.detail.value) || 0;
    time = Math.max(0, Math.min(300, time));
    const exercise = this.data.exercise;
    exercise.anaerobicTime = time;
    this.setData({ exercise });
  },

  saveExerciseInfo() {
    const app = getApp();
    app.globalData.exercise = this.data.exercise;
    app.saveData();

    this.calculateAll();
    this.closeExerciseModal();

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });
  },

  // ==================== 饮食模式模态框 ====================
  openDietModal() {
    this.setData({ showDietModal: true });
  },

  closeDietModal() {
    this.setData({ showDietModal: false });
  },

  onDietModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ dietMode: mode });
  },

  onCustomCarbsInput(e) {
    let carbs = parseInt(e.detail.value) || null;
    const customNutrition = this.data.customNutrition;
    customNutrition.carbs = carbs;
    this.setData({ customNutrition });
  },

  onCustomProteinInput(e) {
    let protein = parseInt(e.detail.value) || null;
    const customNutrition = this.data.customNutrition;
    customNutrition.protein = protein;
    this.setData({ customNutrition });
  },

  onCustomFatInput(e) {
    let fat = parseInt(e.detail.value) || null;
    const customNutrition = this.data.customNutrition;
    customNutrition.fat = fat;
    this.setData({ customNutrition });
  },

  saveDietInfo() {
    const { dietMode, customNutrition } = this.data;

    if (dietMode === 'custom') {
      if (customNutrition.carbs === null || customNutrition.protein === null || customNutrition.fat === null) {
        wx.showToast({
          title: '请填写完整营养数据',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }

    const app = getApp();
    app.globalData.dietMode = dietMode;
    app.globalData.customNutrition = customNutrition;
    app.saveData();

    this.calculateAll();
    this.closeDietModal();

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });
  },

  // ==================== 体重记录模态框 ====================
  openWeightModal() {
    this.setData({
      showWeightModal: true,
      tempWeight: this.data.currentWeight,
      tempTargetWeight: this.data.targetWeight
    });
  },

  closeWeightModal() {
    this.setData({ showWeightModal: false });
  },

  onCurrentWeightInput(e) {
    let weight = parseFloat(e.detail.value) || null;
    if (weight !== null) {
      weight = Math.max(30, Math.min(200, weight));
    }
    this.setData({ tempWeight: weight });
  },

  onTargetWeightInput(e) {
    let weight = parseFloat(e.detail.value) || null;
    if (weight !== null) {
      weight = Math.max(30, Math.min(200, weight));
    }
    this.setData({ tempTargetWeight: weight });
  },

  recordWeight() {
    const { tempWeight, tempTargetWeight } = this.data;

    if (tempWeight === null) {
      wx.showToast({
        title: '请输入当前体重',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const app = getApp();
    app.recordWeight(tempWeight);

    if (tempTargetWeight !== null) {
      app.globalData.targetWeight = tempTargetWeight;
    }

    app.saveData();

    this.setData({
      weightRecords: app.globalData.weightRecords,
      currentWeight: app.globalData.currentWeight,
      targetWeight: app.globalData.targetWeight
    });

    this.closeWeightModal();

    wx.showToast({
      title: '记录成功',
      icon: 'success',
      duration: 1500
    });
  },

  // ==================== 计算逻辑 ====================
  calculateAll() {
    const app = getApp();

    app.calculateTDEE();
    app.calculateBMI();
    app.calculateNutrition();

    this.setData({
      results: app.globalData.results,
      exercise: app.globalData.exercise
    });
  },

  // ==================== 辅助方法 ====================
  formatDate(dateStr) {
    if (!dateStr) return '';
    return dateStr.substring(5, 16); // 格式：03-01 10:30
  },

  getWeightChangePercent() {
    const { currentWeight, targetWeight, userInfo } = this.data;
    
    if (!currentWeight || !targetWeight || !userInfo.weight) return 0;

    const totalNeedToLose = userInfo.weight - targetWeight;
    const alreadyLost = userInfo.weight - currentWeight;
    
    if (totalNeedToLose <= 0) return 0;
    
    return Math.min(100, Math.round((alreadyLost / totalNeedToLose) * 100));
  },

  isUserInfoComplete() {
    const { age, height, weight } = this.data.userInfo;
    return age !== null && height !== null && weight !== null;
  }
});
