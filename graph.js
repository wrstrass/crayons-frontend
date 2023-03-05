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
        this.konva_element = new Konva.Line({
            points: [begin.x, begin.y, end.x, end.y],
            stroke: "black",
            strokeWidth: 2,
            draggable: true
        });

        this.konva_element.on("dragmove", (ev) => {
            let points = this.konva_element.points();
            this.konva_element.points([
                points[0] + ev.evt.movementX,
                points[1] + ev.evt.movementY,
                points[2] + ev.evt.movementX,
                points[3] + ev.evt.movementY
            ]);
            this.konva_element.x(0);
            this.konva_element.y(0);
        });
    }

    begin(point = null) {
        if (point !== null) {
            let end = this.end();
            this.konva_element.points([point.x, point.y, end.x, end.y]);
        }
        let begin = this.konva_element.points().slice(0, 2);
        return new Point(begin[0], begin[1]);
    }
    end(point = null) {
        if (point !== null) {
            let begin = this.begin();
            this.konva_element.points([begin.x, begin.y, point.x, point.y]);
        }
        let end = this.konva_element.points().slice(2);
        return new Point(end[0], end[1]);
    }

    highlight_points() {
        return [this.begin(), this.end()];
    }
}

window.Rect = class Rect {
    constructor(top_left = new Point(), bottom_right = new Point()) {
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
            let bottom_right = this.bottom_right();
            this.konva_element.x(point.x);
            this.konva_element.y(point.y);
            this.konva_element.width(bottom_right.x - point.x);
            this.konva_element.height(bottom_right.y - point.y);
        }
        return new Point(this.konva_element.x(), this.konva_element.y());
    }
    bottom_right(point = null) {
        let top_left = this.top_left();
        if (point !== null) {
            this.konva_element.width(point.x - top_left.x);
            this.konva_element.height(point.y - top_left.y);
        }
        top_left.x += this.konva_element.width();
        top_left.y += this.konva_element.height();
        return top_left;
    }

    highlight_points() {
        let top_left = this.top_left();
        let bottom_right = this.bottom_right();
        let top_right = new Point(bottom_right.x, top_left.y);
        let bottom_left = new Point(top_left.x, bottom_right.y);

        let top = new Point((top_left.x + top_right.x) / 2, top_left.y);
        let right = new Point(top_right.x, (top_right.y + bottom_right.y) / 2);
        let bottom = new Point((bottom_left.x + bottom_right.x) / 2, bottom_right.y);
        let left = new Point(top_left.x, (top_left.y + bottom_left.y) / 2);

        return [
            top_left,
            top,
            top_right,
            right,
            bottom_right,
            bottom,
            bottom_left,
            left
        ];
    }
}


window.distance = function (A, B) {
    return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
}
