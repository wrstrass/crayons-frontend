class BaseHTMLLine {
    constructor(type, begin_x = 0, begin_y = 0, end_x = 0, end_y = 0) {
        this.container = document.createElement("div");
        this.container.classList.add(type);
        this.container.innerHTML = "<h1>" + type + "</h1>";

        this.begin = document.createElement("p");
        this.begin.classList.add("begin");
        this.begin.innerHTML = "Begin: x <input type=\"text\" class=\"x\"> y <input type=\"text\" class=\"y\">";
        this.begin_x = this.begin.getElementsByClassName("x")[0];
        this.begin_x.value = begin_x;
        this.begin_y = this.begin.getElementsByClassName("y")[0];
        this.begin_y.value = begin_y;
        this.container.appendChild(this.begin);

        this.end = document.createElement("p");
        this.end.classList.add("end");
        this.end.innerHTML = "End: x <input type=\"text\" class=\"x\"> y <input type=\"text\" class=\"y\">";
        this.end_x = this.end.getElementsByClassName("x")[0];
        this.end_x.value = end_x;
        this.end_y = this.end.getElementsByClassName("y")[0];
        this.end_y.value = end_y;
        this.container.appendChild(this.end);

        [this.begin_x, this.begin_y, this.end_x, this.end_y].forEach((el) => {
            el.addEventListener("input", (ev) => {
                this.shape.begin(new Point(
                    +this.begin_x.value, +this.begin_y.value
                ));
                this.shape.end(new Point(
                    +this.end_x.value, +this.end_y.value
                ));
            })
        });

        this.container.addEventListener("click", () => {
            this.shape.activate();
        });
    }

    set_shape(shape) {
        this.shape = shape;
    }

    set_points(begin_x, begin_y, end_x, end_y) {
        this.begin_x.value = begin_x;
        this.begin_y.value = begin_y;
        this.end_x.value = end_x;
        this.end_y.value = end_y;
    }
    set_begin(x, y) {
        this.begin_x.value = x;
        this.begin_y.value = y;
    }
    set_end(x, y) {
        this.end_x.value = x;
        this.end_y.value = y;
    }

    highlight(bool_flag) {
        if (bool_flag) {
            this.container.id = "active_shape";
        }
        else {
            this.container.id = "";
        }
    }
}


window.HTMLLine = class HTMLLine extends BaseHTMLLine {
    constructor (begin_x = 0, begin_y = 0, end_x = 0, end_y = 0) {
        super("Line", begin_x, begin_y, end_x, end_y);
    }
}

window.HTMLArrow = class HTMLArrow extends BaseHTMLLine {
    constructor (begin_x = 0, begin_y = 0, end_x = 0, end_y = 0) {
        super("Arrow", begin_x, begin_y, end_x, end_y);
    }
}
