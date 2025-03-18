// 料金プランごとの設定
const plans = {
    1: { base: 1950, tiers: [{ limit: 20, rate: 730 }, { limit: Infinity, rate: 680 }] },
    3: { base: 1950, tiers: [{ limit: 10, rate: 600 }, { limit: Infinity, rate: 500 }] },
    4: { base: 1100, tiers: [{ limit: Infinity, rate: 400 }] },
    8: { base: 800, tiers: [{ limit: 1.4, rate: 0 }, { limit: Infinity, rate: 720 }] },
    9: { base: 1900, tiers: [{ limit: 5, rate: 610 }, { limit: Infinity, rate: 520 }] },
    10: { base: 1600, tiers: [{ limit: Infinity, rate: 530 }] },
};

// 料金計算を行う関数
function calculateBill(planNumber, usage, days) {
    const plan = plans[planNumber];
    if (!plan) return null;

    // 1日あたりの基本料金（小数点そのまま）
    const dailyBaseRate = plan.base / 30;
    // 基本料金（日数分）
    const totalBaseRate = dailyBaseRate * days;

    // 従量料金の計算
    let consumptionRate = 0;
    let remainingUsage = usage;

    for (const tier of plan.tiers) {
        if (remainingUsage > 0) {
            const tierUsage = Math.min(remainingUsage, tier.limit);
            consumptionRate += tierUsage * tier.rate;
            remainingUsage -= tierUsage;
        } else {
            break;
        }
    }

    // 小計の計算
    const subtotal = totalBaseRate + consumptionRate;
    // 消費税（10%）
    const tax = Math.floor(subtotal * 0.1);
    // 合計金額（小数点切り捨て）
    const total = Math.floor(subtotal + tax);

    // 計算結果を返す
    return {
        baseRate: Math.round(totalBaseRate),  // 基本料金（四捨五入）
        totalBaseRate: Math.round(totalBaseRate),  
        consumptionRate: Math.floor(consumptionRate),  // 従量料金（切り捨て）
        subtotal: Math.floor(subtotal),  // 小計（切り捨て）
        tax: tax,  // 消費税（切り捨て）
        total: total  // 合計（切り捨て）
    };
}

// 計算を実行する関数
function performCalculation() {
    // 入力値を取得
    const planNumber = parseInt(document.getElementById('plan').value);
    const usage = parseFloat(document.getElementById('usage').value);
    const days = parseInt(document.getElementById('days').value);

    // 入力チェック
    if (isNaN(usage) || usage < 0 || isNaN(days) || days <= 0) {
        alert("有効な使用量と使った日数を入力してください");
        return;
    }

    // 料金計算を実行
    const result = calculateBill(planNumber, usage, days);

    // 結果をHTMLに表示
    document.getElementById('baseRate').textContent = `基本料金 = ¥${result.totalBaseRate}`;
    document.getElementById('consumptionRate').textContent = `従量料金 = ¥${result.consumptionRate}`;
    document.getElementById('subtotal').textContent = `小計 = ¥${result.subtotal}`;
    document.getElementById('tax').textContent = `消費税 = ¥${result.tax}`;
    document.getElementById('total').textContent = `合計 = ¥${result.total}`;
}