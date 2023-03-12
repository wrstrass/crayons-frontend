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


class Shape {
    constructor(edit_window, konva_element, html_shape) {
        this._edit_window = edit_window;
        this.konva_element = konva_element;
        this.html_shape = html_shape;
        this.html_shape.set_shape(this);

        this.konva_element.on("click", (ev) => {
            this._edit_window.activate(this);
        });
        this.konva_element.on("dragstart", (ev) => {
            this._edit_window.activate(this);
        });
    }

    highlight(bool_flag) {
        if (bool_flag) {
            this.konva_element.shadowColor("blue");
            this.konva_element.shadowBlur(7);
            this.konva_element.shadowOffset({x: 0, y: 0});
            this.konva_element.shadowOpacity(1);
        }
        else {
            this.konva_element.shadowOpacity(0);
        }
    }

    highlight_points() {
        throw Error("Not Implemented");
    }
}


class BaseLine extends Shape {
    constructor(edit_window, konva_element, html_shape) {
        super(edit_window, konva_element, html_shape);

        this.konva_element.on("dragstart", (ev) => {
            let mouse = new Point(ev.evt.offsetX, ev.evt.offsetY);
            if (distance(mouse, this.begin()) <= eps) {
                this._drag_type = 1;
            }
            else if (distance(mouse, this.end()) <= eps) {
                this._drag_type = 2;
            }
            else {
                this._drag_type = 3;
            }
        });
        this.konva_element.on("dragmove", (ev) => {
            if (this._drag_type == 3) {
                let points = this.konva_element.points();
                this.begin(new Point(points[0] + ev.evt.movementX, points[1] + ev.evt.movementY));
                this.end(new Point(points[2] + ev.evt.movementX, points[3] + ev.evt.movementY));
            }
            else {
                let mouse = new Point(ev.evt.offsetX, ev.evt.offsetY);
                let nearest = (ev.evt.ctrlKey)? this._edit_window.find_nearest(mouse) : null;
                let result_point = (nearest === null)? mouse : nearest;

                if (this._drag_type == 1) {
                    this.begin(result_point);
                }
                else if (this._drag_type == 2) {
                    this.end(result_point);
                }
            }
            this.konva_element.x(0);
            this.konva_element.y(0);
        });
    }

    begin(point = null) {
        if (point !== null) {
            let end = this.end();
            this.konva_element.points([point.x, point.y, end.x, end.y]);
            this.html_shape.set_points(point.x, point.y, end.x, end.y);
        }
        let begin = this.konva_element.points().slice(0, 2);
        return new Point(begin[0], begin[1]);
    }
    end(point = null) {
        if (point !== null) {
            let begin = this.begin();
            this.konva_element.points([begin.x, begin.y, point.x, point.y]);
            this.html_shape.set_points(begin.x, begin.y, point.x, point.y);
        }
        let end = this.konva_element.points().slice(2);
        return new Point(end[0], end[1]);
    }

    highlight_points() {
        return [this.begin(), this.end()];
    }
}


window.Line = class Line extends BaseLine {
    constructor(edit_window, begin = new Point(), end = new Point()) {
        super(edit_window, new Konva.Line({
            points: [begin.x, begin.y, end.x, end.y],
            stroke: "black",
            strokeWidth: 2
        }), new HTMLLine(begin.x, begin.y, end.x, end.y));
    }
}


window.Arrow = class Arrow extends BaseLine {
    constructor(edit_window, begin = new Point(), end = new Point()) {
        super(edit_window, new Konva.Arrow({
            points: [begin.x, begin.y, end.x, end.y],
            pointerLength: 10,
            pointerWidth: 10,
            fill: "black",
            stroke: "black",
            strokeWidth: 2
        }), new HTMLArrow(begin.x, begin.y, end.x, end.y));
    }
}


window.Rect = class Rect extends Shape {
    constructor(edit_window, top_left = new Point(), bottom_right = new Point()) {
        super(edit_window, new Konva.Rect({
            x: top_left.x,
            y: top_left.y,
            width: (bottom_right.x - top_left.x),
            height: (bottom_right.y - top_left.y),
            stroke: "black",
            strokeWidth: 2
        }));
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
