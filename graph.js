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

window.Rect = class Rect {
    constructor(top_left = new Point(), bottom_right = new Point()) {
        this.top_left = top_left;
        this.bottom_right = bottom_right;

        this.top_right = new Point();
        this.bottom_left = new Point();

        this.top = new Point();
        this.right = new Point();
        this.bottom = new Point();
        this.left = new Point();
    }

    highlight_points() {
        this.top_right.x = this.bottom_right.x;
        this.top_right.y = this.top_left.y;

        this.bottom_left.x = this.top_left.x;
        this.bottom_left.y = this.bottom_right.y;

        this.top.x = (this.top_left.x + this.top_right.x) / 2;
        this.top.y = this.top_left.y;
        this.right.x = this.top_right.x;
        this.right.y = (this.top_right.y + this.bottom_right.y) / 2;
        this.bottom.x = (this.bottom_left.x + this.bottom_right.x) / 2;
        this.bottom.y = this.bottom_right.y;
        this.left.x = this.top_left.x;
        this.left.y = (this.top_left.y + this.bottom_left.y) / 2;

        return [
            this.top_left,
            this.top_right,
            this.bottom_left,
            this.bottom_right,
            this.top,
            this.right,
            this.bottom,
            this.left
        ];
    }

    draw(context) {
        context.beginPath();
        let width = this.bottom_right.x - this.top_left.x;
        let height = this.bottom_right.y - this.top_left.y;
        context.strokeRect(this.top_left.x, this.top_left.y, width, height);
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
