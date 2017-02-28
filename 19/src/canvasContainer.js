function CanvasContainer(id, options) {
    if (!id) {
        console.warn("id is not set");
    }
    this.init(id, options);

}


CanvasContainer.prototype.init = function (id, options) {
    this.props = {
        zoomLevel: 1,
        center: new Point(0, 0),
        image: {},
        thumbnail: {
            width: "10%",
            height: "10%",
            alwaysShowAll: true
        },
        width:1000
    };
    this.props = $.extend(this.props, options);
    this.image = new Image();
    this.image.src= this.props.image.src;
    this.image.width = (this.props.image.right - this.props.image.left);
    this.image.height = (this.props.image.bottom - this.props.image.top);
    this.center = this.props.center;
    this.zoomLevel = this.props.zoomLevel;
    this._$container = $("#" + id);
    if (this._$container === undefined) {
        return;
    }
    this.$canvas = $(document.createElement("canvas"))
        .appendTo(this._$container)
        .css("width", "100%")
        .css("height", "100%");
    this.$canvas.attr("width",this.props.width)
        .attr("height", this.props.width*this.$canvas.height()/(this.$canvas.width()+ 0.));
    this.canvasContext = this.$canvas[0].getContext("2d");

    var thumbnailConfig = this.props.thumbnail;
    // this.$thumbnailCanvas = $(document.createElement("canvas"))
    //     .appendTo(this._$container)
    //     .css("width", thumbnailConfig.width)
    //     .css("height", thumbnailConfig.height);

    this.setView(this.props.center, this.props.zoomLevel);

};

CanvasContainer.prototype.setView = function (center, zoom, options) {
    var _this = this;
    this.image.onload = function () {
        var image = _this.image;
        var dx = 0;
        var dy = 0;
        var dWidth = 0;
        var dHeight = 0;
        var sx = 0;
        var sy = 0;
        var sHeight = 0;
        var sWidth = 0;

        var currentRectangle = {
            left: center.x - _this.$canvas.attr("width") * zoom / 2.,
            top: center.y - _this.$canvas.attr("height") * zoom / 2.,
            right: center.x + _this.$canvas.attr("width") * zoom / 2.,
            bottom: center.y + _this.$canvas.attr("height") * zoom / 2.
        };
        var imageRectangle = _this.props.image;

        if (intersect(currentRectangle, _this.props.image)) {
            var intersectRec = intersectRectangle(currentRectangle, _this.props.image);
            dx = intersectRec.left - currentRectangle.left;
            dy = intersectRec.top - currentRectangle.top;
            dWidth = imageRectangle.right - imageRectangle.left;
            dHeight = imageRectangle.bottom - imageRectangle.top;
            _this.canvasContext.clearRect(0, 0, _this.$canvas.attr("width"), _this.$canvas.attr("height"));
            _this.canvasContext.drawImage(image, dx, dy, dWidth, dHeight);
        } else {
            _this.canvasContext.clearRect(0, 0, _this.$canvas.width(), _this.$canvas.height());
        }
    }




};

CanvasContainer.prototype.onMove = function () {
    var _this = this;
    var ifDrag = false;
    this.$canvas.addEventListener("mousedown", function () {
        ifDrag = true;
        console.log();
    });
    this.$canvas.addEventListener("mousemove", function () {
        ifDrag = false;
    });
    this.$canvas.addEventListener("mouseup", function (type, evt) {
        if (ifDrag) {
            
        }
        else {

        }
    });
};

//arg can be [x, y] or {x:x, y:y} or  x,y
function Point() {
    if (arguments.length == 2) {
        return {x: arguments[0], y: arguments[1]};
    }
    if (arguments.length == 1) {
        var input = arguments[0];
        if (input instanceof Array) {
            return {x: input[0], y: input[1]};
        } else {
            return {x: input.x, y: input.y};
        }
    }
    throw new Error("Illegal Argument: " + arguments);
}

function Rectangle(left, top, right, bottom) {
    return {
        left: 10,
        top: 10,
        right: 30,
        bottom: 30
    }
}

function intersect(a, b) {
    return (a.left <= b.right &&
    b.left <= a.right &&
    a.top <= b.bottom &&
    b.top <= a.bottom)
}

function intersectRectangle(a, b) {
    // return Math.max(a.left, b.left) < Math.min(a.right, b.right) &&
    //     Math.max(a.top, b.top) < Math.min(a.bottom, b.bottom);
    return {
        left: Math.max(a.left, b.left),
        top: Math.max(a.top, b.top),
        right:  Math.min(a.right, b.right),
        bottom: Math.min(a.bottom, b.bottom)
    }
}