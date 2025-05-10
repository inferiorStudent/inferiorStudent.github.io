## 傅里叶变换公式

基本定义：
$$ \hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{-2\pi i x \xi} dx $$

重要性质：
- **线性性**: $ \mathcal{F}\{af + bg\} = a\mathcal{F}\{f\} + b\mathcal{F}\{g\} $
- <span style="color:blue">时移特性</span>：
  $$ \mathcal{F}\{f(x - x_0)\} = e^{-2\pi i x_0 \xi} \hat{f}(\xi) $$

<div class="warning">
  注意：该公式仅适用于绝对可积函数
</div>
