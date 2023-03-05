window.eps = 15;


window.Point = class Point {
    constructor(x = 0, y = 0) {
        if (x instanceof Point) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
}

window.Line = class Line {
    constructor(begin = new Point(), end = new Point()) {
        this._begin = begin;
        this._end = end;
        this.konva_element = new Konva.Line({
            points: [this._begin.x, this._begin.y, this._end.x, this._end.y],
            stroke: "black",
            strokeWidth: 2,
            draggable: true
        })
    }

    begin(point = null) {
        if (point !== null) {
            this._begin = new Point(point);
            this.konva_element.points([this._begin.x, this._begin.y, this._end.x, this._end.y]);
        }
        return new Point(this._begin);
    }
    end(point = null) {
        if (point !== null) {
            this._end = new Point(point);
            this.konva_element.points([this._begin.x, this._begin.y, this._end.x, this._end.y]);
        }
        return new Point(this._end);
    }

    highlight_points() {
        return [new Point(this._begin), new Point(this._end)];
    }
}

window.Rect = class Rect {
    constructor(top_left = new Point(), bottom_right = new Point()) {
        this._top_left = new Point(top_left);
        this._bottom_right = new Point(bottom_right);
        this.konva_element = new Konva.Rect({
            x: top_left.x,
            y: top_left.y,
            width: (bottom_right.x - top_left.x),
            height: (bottom_right.y - top_left.y),
            stroke: "black",
            strokeWidth: 2,
            draggable: true
        });
    }

    top_left(point = null) {
        if (point !== null) {
            this._top_left = new Point(point);
            this.konva_element.x(top_left.x);
            this.konva_element.y(top_left.y);
            this.konva_element.width(this._bottom_right.x - this._top_left.x);
            this.konva_element.height(this._bottom_right.y - this._top_left.y);
        }
        return new Point(this._top_left);
    }
    bottom_right(point = null) {
        if (point !== null) {
            this._bottom_right = new Point(point);
            this.konva_element.width(this._bottom_right.x - this._top_left.x);
            this.konva_element.height(this._bottom_right.y - this._top_left.y);
        }
        return new Point(this._bottom_right);
    }

    highlight_points() {
        let top_right = new Point(this._bottom_right.x, this._top_left.y);
        let bottom_left = new Point(this._top_left.x, this._bottom_right.y);

        let top = new Point((this._top_left.x + top_right.x) / 2, this._top_left.y);
        let right = new Point(top_right.x, (top_right.y + this._bottom_right.y) / 2);
        let bottom = new Point((bottom_left.x + this._bottom_right.x) / 2, this._bottom_right.y);
        let left = new Point(this._top_left.x, (this._top_left.y + bottom_left.y) / 2);

        return [
            new Point(this._top_left),
            top,
            top_right,
            right,
            new Point(this._bottom_right),
            bottom,
            bottom_left,
            left
        ];
    }
}


window.distance = function (A, B) {
    return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
}
