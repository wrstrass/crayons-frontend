class EditWindow {
    constructor(edit_window, shapes_list) {
        this._edit_window = edit_window;
        this._shapes_list = shapes_list;

        this._konva_stage = new Konva.Stage({
            container: this._edit_window.id,
            width: this._edit_window.clientWidth,
            height: this._edit_window.clientHeight
        })
        this._konva_layer = new Konva.Layer();
        this._konva_stage.add(this._konva_layer);

        this.draw_mode = "line";
        let draw_buttons = document.getElementsByClassName("draw_mode_button");
        for (let i = 0; i < draw_buttons.length; i++) {
            draw_buttons[i].addEventListener("click", (ev) => {
                document.getElementById("current_mode").id = "";
                draw_buttons[i].id = "current_mode";

                this.draw_mode = draw_buttons[i].innerHTML;
                if (this.draw_mode == "drag") {
                    this.drag(true);
                    this.activate(null);
                }
                else this.drag(false);
            });
        }

        this._elements = [];
        this._hpoints = [];
        this._active_element = null;

        this._click_count = 0;

        window.addEventListener("resize", (ev) => {
            this._konva_stage.width = this._edit_window.clientWidth;
            this._konva_stage.height = this._edit_window.clientHeight;
        });
    }

    add_click() {
        this._click_count = (this._click_count + 1) % 2;
    }
    first_click() {
        return this._click_count == 1;
    }

    get_active_element() {
        return this._active_element;
    }
    activate(obj = null) {
        this._elements.forEach((el) => {
            el.highlight(false);
        });
        if (obj !== null) obj.highlight(true);
        this._active_element = obj;
    }
    add_element(el) {
        this._elements.push(el);
        this._konva_layer.add(el.konva_element);
        this._shapes_list.appendChild(el.html_shape.container);
        this.activate(el);
    }

    drag(bool_flag) {
        this._elements.forEach((el) => {
            el.konva_element.draggable(bool_flag);
        });
    }


    highlight_points() {
        let elements = this._elements.slice();
        if (this.get_active_element() !== null) {
            elements.splice(elements.indexOf(this.get_active_element()), 1);
        }

        let result = [];
        elements.forEach((el) => {
            el.highlight_points().forEach((point) => {
                let found = false;
                result.forEach((result_point) => {
                    if (point.x == result_point.x && point.y == result_point.y)
                        found = true;
                });
                if (!found) result.push(point);
            });
        });
        return result;
    }
    find_nearest(point) {
        let result = null;
        this.highlight_points().forEach((hpoint) => {
            if (result === null)
                if (distance(point, hpoint) <= eps) {
                    result = hpoint;
                    return;
                }
        });
        return result;
    }

    highlight() {
        this._hpoints = [];
        this.highlight_points().forEach((hpoint) => {
            let circle = new Konva.Circle({
                x: hpoint.x,
                y: hpoint.y,
                radius: eps,
                fill: "rgba(0, 0, 255, 0.2)",
                stroke: "rgba(0, 0, 255, 0.2)",
                strokeWidth: 2
            });
            this._konva_layer.add(circle);
            this._hpoints.push(circle);
        });
    }
    remove_highlight() {
        this._hpoints.forEach((hpoint) => {
            hpoint.destroy();
        });
        this._hpoints = [];
    }
};

window.onload = function () {
    let edit_window = new EditWindow(
        document.getElementById("edit_window"),
        document.getElementById("shapes_list"),
    );

    edit_window._edit_window.addEventListener("click", (ev) => {
        if (edit_window.draw_mode == "drag") return;

        if (!edit_window.first_click()) {
            let ev_point = new Point(ev.offsetX, ev.offsetY);
            let nearest = (ev.ctrlKey)? edit_window.find_nearest(ev_point) : null;
            let result_point = (nearest === null)? ev_point : nearest;

            if (edit_window.draw_mode == "line") {
                edit_window.add_element(new Line(
                    edit_window, new Point(result_point), new Point(result_point)
                ));
            }
            else if (edit_window.draw_mode == "arrow") {
                edit_window.add_element(new Arrow(
                    edit_window, new Point(result_point), new Point(result_point)
                ));
            }
            else if (edit_window.draw_mode == "rect") {
                edit_window.add_element(new Rect(
                    edit_window, new Point(result_point), new Point(result_point)
                ));
            }
        }
        edit_window.add_click();
    });

    edit_window._edit_window.addEventListener("mousemove", (ev) => {
        if (edit_window.first_click()) {
            let ev_point = new Point(ev.offsetX, ev.offsetY);
            let nearest = (ev.ctrlKey)? edit_window.find_nearest(ev_point) : null;
            let result_point = (nearest === null)? ev_point : nearest;

            if (edit_window.draw_mode == "line" || edit_window.draw_mode == "arrow") {
                edit_window.get_active_element().end(result_point);

                if (ev.shiftKey) {
                    dx = Math.abs(ev.clientX - edit_window.get_active_element().begin().x);
                    dy = Math.abs(ev.clientY - edit_window.get_active_element().begin().y);

                    point = edit_window.get_active_element().end();
                    if (dx > dy) {
                        point.y = edit_window.get_active_element().begin().y;
                    }
                    else {
                        point.x = edit_window.get_active_element().begin().x;
                    }
                    edit_window.get_active_element().end(point);
                }
            }
            else if (edit_window.draw_mode == "rect") {
                edit_window.get_active_element().bottom_right(result_point);
            }
        }

        edit_window.remove_highlight();
        if (ev.ctrlKey)
            edit_window.highlight();
    });
}
