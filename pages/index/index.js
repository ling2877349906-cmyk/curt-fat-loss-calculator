Page({
  data: {},

  onLoad() {
    // 页面加载时的逻辑
  },

  onNavigateToCalculator() {
    wx.switchTab({
      url: '/pages/calculator/calculator'
    });
  }
});
