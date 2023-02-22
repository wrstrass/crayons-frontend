window.eps = 15;


window.Point = class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

window.Line = class Line {
    constructor(begin = new Point(), end = new Point()) {
        this.begin = begin;
        this.end = end;
    }

    highlight_points() {
        return [this.begin, this.end];
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.begin.x, this.begin.y);
        context.lineTo(this.end.x, this.end.y);
        context.stroke();
    }
}


window.circle = function (ctx, x, y, radius = eps) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

window.distance = function (A, B) {
    return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
}
