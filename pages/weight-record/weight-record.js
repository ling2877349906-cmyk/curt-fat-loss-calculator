Page({
  data: {
    targetWeight: '',
    currentWeight: '',
    weightRecords: [],
    inputWeight: ''
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    // 加载目标体重和当前体重
    try {
      const predictionData = wx.getStorageSync('predictionData') || {};
      this.setData({
        targetWeight: predictionData.targetWeight || '',
        currentWeight: predictionData.initialWeight || ''
      });
    } catch (e) {
      // 忽略
    }

    // 加载体重记录
    try {
      let records = wx.getStorageSync('weightRecords') || [];
      // 只保留最近7天的记录
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      records = records.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= sevenDaysAgo;
      });
      this.setData({ weightRecords: records });

      // 更新当前体重为最新记录
      if (records.length > 0) {
        const latestWeight = records[records.length - 1].weight;
        this.setData({ currentWeight: latestWeight });
      }

      // 绘制折线图
      if (records.length > 1) {
        setTimeout(() => {
          this.drawChart(records);
        }, 300);
      }
    } catch (e) {
      this.setData({ weightRecords: [] });
    }
  },

  onWeightInput(e) {
    this.setData({ inputWeight: e.detail.value });
  },

  saveWeight() {
    const weight = parseFloat(this.data.inputWeight);
    if (!weight || weight <= 0 || weight > 500) {
      wx.showToast({
        title: '请输入有效体重',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    const now = new Date();
    const timestamp = now.getTime();
    const dateStr = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    try {
      let records = wx.getStorageSync('weightRecords') || [];
      records.push({
        weight: weight,
        timestamp: timestamp,
        dateStr: dateStr
      });

      // 只保留最近7天的记录
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      records = records.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= sevenDaysAgo;
      });

      wx.setStorageSync('weightRecords', records);

      this.setData({
        weightRecords: records,
        currentWeight: weight,
        inputWeight: ''
      });

      wx.showToast({
        title: '体重已记录',
        icon: 'success',
        duration: 1500
      });

      // 重新绘制折线图
      if (records.length > 1) {
        setTimeout(() => {
          this.drawChart(records);
        }, 300);
      }
    } catch (e) {
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none',
        duration: 1500
      });
    }
  },

  drawChart(records) {
    const ctx = wx.createCanvasContext('weightChart', this);
    
    // 获取画布信息
    const query = wx.createSelectorQuery().in(this);
    query.select('.weight-chart').boundingClientRect((rect) => {
      if (!rect) return;

      const width = rect.width;
      const height = rect.height;
      const padding = { top: 30, right: 30, bottom: 40, left: 50 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      // 计算数据范围
      const weights = records.map(r => r.weight);
      const minWeight = Math.floor(Math.min(...weights) - 1);
      const maxWeight = Math.ceil(Math.max(...weights) + 1);
      const weightRange = maxWeight - minWeight || 1;

      // 清空画布
      ctx.clearRect(0, 0, width, height);

      // 绘制背景网格线
      ctx.setStrokeStyle('#f0f0f0');
      ctx.setLineWidth(1);
      const gridCount = 4;
      for (let i = 0; i <= gridCount; i++) {
        const y = padding.top + (chartHeight / gridCount) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        // Y轴标签
        const labelValue = (maxWeight - (weightRange / gridCount) * i).toFixed(1);
        ctx.setFillStyle('#999');
        ctx.setFontSize(10);
        ctx.setTextAlign('right');
        ctx.fillText(labelValue, padding.left - 8, y + 4);
      }

      // 计算数据点坐标
      const points = records.map((record, index) => {
        const x = padding.left + (chartWidth / (records.length - 1 || 1)) * index;
        const y = padding.top + chartHeight - ((record.weight - minWeight) / weightRange) * chartHeight;
        return { x, y, weight: record.weight, dateStr: record.dateStr };
      });

      // 绘制渐变填充区域
      ctx.beginPath();
      ctx.moveTo(points[0].x, height - padding.bottom);
      points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, 'rgba(45, 199, 143, 0.25)');
      gradient.addColorStop(1, 'rgba(45, 199, 143, 0.02)');
      ctx.setFillStyle(gradient);
      ctx.fill();

      // 绘制折线
      ctx.beginPath();
      ctx.setStrokeStyle('#2DC78F');
      ctx.setLineWidth(2.5);
      ctx.setLineJoin('round');
      ctx.setLineCap('round');
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();

      // 绘制数据点
      points.forEach(point => {
        // 外圈白色
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.setFillStyle('#ffffff');
        ctx.fill();
        ctx.setStrokeStyle('#2DC78F');
        ctx.setLineWidth(2);
        ctx.stroke();

        // 内圈绿色
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.5, 0, 2 * Math.PI);
        ctx.setFillStyle('#2DC78F');
        ctx.fill();

        // 数据标签
        ctx.setFillStyle('#2DC78F');
        ctx.setFontSize(10);
        ctx.setTextAlign('center');
        ctx.fillText(point.weight + 'kg', point.x, point.y - 12);
      });

      // X轴日期标签
      points.forEach(point => {
        const dateLabel = point.dateStr.split(' ')[0] || '';
        // 取月/日部分
        const parts = dateLabel.split('/');
        const shortDate = parts.length >= 2 ? parts[1] + '/' + parts[2] : dateLabel;
        ctx.setFillStyle('#999');
        ctx.setFontSize(9);
        ctx.setTextAlign('center');
        ctx.fillText(shortDate, point.x, height - padding.bottom + 16);
      });

      ctx.draw();
    }).exec();
  }
});
