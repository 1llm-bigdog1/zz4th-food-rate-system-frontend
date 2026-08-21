<template>
  <div class="sponsor-page">
    <div class="page-inner">
      <h1 class="page-title">赞助我们</h1>

      <div class="intro">这是一个由学生自主开发与维护的项目。

你的支持将帮助我们承担服务器、域名及项目维护成本，让网站能够持续运行，并不断完善功能与内容。

每一份支持，都是对我们学生创意与实践的鼓励。

感谢你的支持！</div>

      <div class="images">
        <div class="img-slot">
          <img src="../static/images/Alipay.jpg" alt="支付宝" />
        </div>
        <div class="img-slot">
          <img src="../static/images/WechatPay.jpg" alt="微信支付" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这是一个简单的静态赞助页面，占位图片路径和文案由内容团队替换。
</script>

<style scoped>
.sponsor-page {
  display: flex;
  justify-content: center;
  padding: 28px 16px;
}
.page-inner {
  max-width: 920px;
  width: 100%;
}
.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}
.intro {
  color: #555;
  margin-bottom: 20px;
}
.images {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.img-slot {
  flex: 1 1 48%;
  min-height: 180px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}
.img-slot img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
