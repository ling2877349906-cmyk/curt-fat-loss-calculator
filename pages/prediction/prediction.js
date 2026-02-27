Page({
  data: {
    initialWeight: 60,
    targetWeight: 50,
    monthlyLossRatio: 3,
    prediction: {
      totalLoss: 10.00,
      months: 3.33,
      weeks: 14,
      days: 3,
      monthlyLoss: 3.00,
      weeklyLoss: 0.75
    }
  },

  onLoad() {
    const app = getApp();
    this.setData({
      initialWeight: app.globalData.initialWeight,
      targetWeight: app.globalData.targetWeight,
      monthlyLossRatio: app.globalData.monthlyLossRatio
    });
    this.calculatePrediction();
  },

  onInitialWeightInput(e) {
    let initialWeight = parseInt(e.detail.value) || 0;
    initialWeight = Math.max(30, Math.min(200, initialWeight));
    this.setData({ initialWeight });
    const app = getApp();
    app.globalData.initialWeight = initialWeight;
    this.calculatePrediction();
  },

  onTargetWeightInput(e) {
    let targetWeight = parseInt(e.detail.value) || 0;
    targetWeight = Math.max(30, Math.min(200, targetWeight));
    this.setData({ targetWeight });
    const app = getApp();
    app.globalData.targetWeight = targetWeight;
    this.calculatePrediction();
  },

  onRatioIncrease() {
    let ratio = this.data.monthlyLossRatio + 0.5;
    ratio = Math.min(5, ratio);
    this.setData({ monthlyLossRatio: ratio });
    const app = getApp();
    app.globalData.monthlyLossRatio = ratio;
    this.calculatePrediction();
  },

  onRatioDecrease() {
    let ratio = this.data.monthlyLossRatio - 0.5;
    ratio = Math.max(1, ratio);
    this.setData({ monthlyLossRatio: ratio });
    const app = getApp();
    app.globalData.monthlyLossRatio = ratio;
    this.calculatePrediction();
  },

  calculatePrediction() {
    const { initialWeight, targetWeight, monthlyLossRatio } = this.data;
    
    // 验证输入
    if (initialWeight <= targetWeight) {
      wx.showToast({
        title: '初始体重需大于目标体重',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const totalLoss = initialWeight - targetWeight;
    const monthlyLoss = initialWeight * (monthlyLossRatio / 100);
    const months = totalLoss / monthlyLoss;
    const days = months * 30;
    const weeks = Math.floor(days / 7);
    const remainingDays = Math.round(days % 7);
    const weeklyLoss = monthlyLoss / 4;

    const prediction = {
      totalLoss: parseFloat(totalLoss.toFixed(2)),
      months: parseFloat(months.toFixed(2)),
      weeks: weeks,
      days: remainingDays,
      monthlyLoss: parseFloat(monthlyLoss.toFixed(2)),
      weeklyLoss: parseFloat(weeklyLoss.toFixed(2))
    };

    this.setData({ prediction });
  },

  onSaveTarget() {
    const { initialWeight, targetWeight, monthlyLossRatio } = this.data;
    
    // 保存到本地存储
    wx.setStorageSync('targetWeight', targetWeight);
    wx.setStorageSync('initialWeight', initialWeight);
    wx.setStorageSync('monthlyLossRatio', monthlyLossRatio);

    wx.showToast({
      title: '目标已保存',
      icon: 'success',
      duration: 1500
    });
  }
});
