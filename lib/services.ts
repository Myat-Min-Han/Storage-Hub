export function getTrend(currentNumber: number, previosNumber: number) {
        const diff: number = currentNumber - previosNumber;
        return {
            diff,
            isUp: diff > 0,
            isDown: diff < 0
        }
};





