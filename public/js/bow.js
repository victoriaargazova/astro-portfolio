let bow;

function setup() {
    const hero = document.querySelector(".hero");
    const firstLetter = document.querySelector(".first-letter");
    const container = document.querySelector("#bow-canvas");

    if (!hero || !firstLetter || !container) return;

    const heroRect = hero.getBoundingClientRect();
    const cnv = createCanvas(heroRect.width, heroRect.height);
    cnv.parent(container);

    bow = createBowForHero(heroRect, firstLetter);
}

function draw() {
    if (!bow) return;

    clear(); 
    bow.update();
    bow.render();
}

function windowResized() {
    const hero = document.querySelector(".hero");
    const firstLetter = document.querySelector(".first-letter");
    const container = document.querySelector("#bow-canvas");

    if (!hero || !firstLetter || !container) return;

    const heroRect = hero.getBoundingClientRect();

    resizeCanvas(heroRect.width, heroRect.height);

    bow = createBowForHero(heroRect, firstLetter);
}


function computeBowSize(heroRect) {
    const vw = window.innerWidth;

    let sizeFromHeight = heroRect.height * 0.35;
    let sizeFromWidth = heroRect.width * 0.22;
    let baseSize = (sizeFromHeight + sizeFromWidth) / 2;

    if (vw < 700) {
        baseSize *= 0.9;
    } else if (vw > 1200) {
        baseSize *= 1.1;
    }

    return constrain(baseSize, 70, 200);
}

function createBowForHero(heroRect, firstLetterEl) {
    const letterRect = firstLetterEl.getBoundingClientRect();
    const bowSize = computeBowSize(heroRect);

    const offsetX = 10;
    const bowX = letterRect.left - heroRect.left + offsetX;

    const vw = window.innerWidth;
    let verticalOffset;
    if (vw < 700) {
        verticalOffset = -10;
    } else {
        verticalOffset = 50;
    }

    let bowY = letterRect.top - heroRect.top - verticalOffset;
    bowY = max(bowSize * 0.6, bowY);

    return new Bow(bowX, bowY, bowSize);
}


class Bow {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;

        this.half = size / 2;
        this.knotW = size * 0.28;
        this.knotH = size * 0.22;

        this.tLeft = 0;
        this.tRight = 0;
        this.tTail1 = 0;
        this.tTail2 = 0;
        this.knotProgress = 0;

        this.phase = "left";


        this.rotation = 0; 
        this.rotationTarget = -0.18; 
        this.rotationSpeed = 0.04;  
        this.rotationStarted = false;
    }

    update() {
        if (this.phase === "left") {
            this.tLeft += 0.03;
            if (this.tLeft >= 1) {
                this.tLeft = 1;
                this.phase = "right";
            }
        } else if (this.phase === "right") {
            this.tRight += 0.03;
            if (this.tRight >= 1) {
                this.tRight = 1;
                this.phase = "tail1";
            }
        } else if (this.phase === "tail1") {
            this.tTail1 += 0.05;
            if (this.tTail1 >= 1) {
                this.tTail1 = 1;
                this.phase = "tail2";
            }
        } else if (this.phase === "tail2") {
            this.tTail2 += 0.05;
            if (this.tTail2 >= 1) {
                this.tTail2 = 1;
                this.phase = "knot";
            }
        } else if (this.phase === "knot") {
            this.knotProgress += 0.05;
            if (this.knotProgress >= 1) {
                this.knotProgress = 1;
                this.phase = "done";
                this.rotationStarted = true;
            }
        }

        if (this.rotationStarted) {
            this.rotation += (this.rotationTarget - this.rotation) * this.rotationSpeed;
            if (abs(this.rotation - this.rotationTarget) < 0.001) {
                this.rotation = this.rotationTarget;
                this.rotationStarted = false;
            }
        }
    }


    drawBezierPartial(x0, y0, x1, y1, x2, y2, x3, y3, tMax, segments = 40) {
        if (tMax <= 0) return;
        let steps = floor(constrain(tMax, 0, 1) * segments);
        if (steps < 1) return;

        let prevT = 0;
        for (let i = 1; i <= steps; i++) {
            let t = (tMax * i) / steps;
            this.drawBezierSegment(x0, y0, x1, y1, x2, y2, x3, y3, prevT, t);
            prevT = t;
        }
    }

    drawBezierSegment(x0, y0, x1, y1, x2, y2, x3, y3, tPrev, tCur) {
        let ax = bezierPoint(x0, x1, x2, x3, tPrev);
        let ay = bezierPoint(y0, y1, y2, y3, tPrev);
        let bx = bezierPoint(x0, x1, x2, x3, tCur);
        let by = bezierPoint(y0, y1, y2, y3, tCur);
        line(ax, ay, bx, by);
    }

    render() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);

        stroke(255, 50, 50);
        strokeWeight(7);
        noFill();

        this.drawBezierPartial(
            0,
            0,
            -this.half * 1.2,
            -this.half * 0.8,
            -this.half * 1.1,
            this.half * 0.8,
            0,
            0,
            this.tLeft
        );

        this.drawBezierPartial(
            0,
            0,
            this.half * 1.2,
            -this.half * 0.8,
            this.half * 1.1,
            this.half * 0.8,
            0,
            0,
            this.tRight
        );

        let x0 = -this.knotW * 0.3;
        let y0 = this.knotH * 0.2;
        this.drawBezierPartial(
            x0,
            y0,
            x0 - this.size * 0.02,
            y0 + this.size * 0.1,
            x0 - this.size * 0.04,
            y0 + this.size * 0.2,
            x0 + this.size * 0.01,
            y0 + this.size * 0.7,
            this.tTail1
        );

        x0 = this.knotW * 0.3;
        y0 = this.knotH * 0.2;
        this.drawBezierPartial(
            x0,
            y0,
            x0 + this.size * 0.02,
            y0 + this.size * 0.1,
            x0 + this.size * 0.04,
            y0 + this.size * 0.2,
            x0 - this.size * 0.01,
            y0 + this.size * 0.7,
            this.tTail2
        );

        this.renderKnot();

        pop();
    }

    renderKnot() {
        const w = this.knotW * 0.45;
        const h = this.knotH * 0.45;
        rectMode(CENTER);
        let c = color(255, 40, 40);

        if (this.phase === "knot" && this.knotProgress < 1) {
            strokeWeight(12)
            stroke(c);
            noFill();

            let p = this.knotProgress;
            let t = p * 4;

            if (t > 0)
                line(-w / 2, -h / 2, -w / 2 + min(w, w * t), -h / 2);
            if (t > 1)
                line(
                    w / 2,
                    -h / 2,
                    w / 2,
                    -h / 2 + min(h, h * (t - 1))
                );
            if (t > 2)
                line(
                    w / 2,
                    h / 2,
                    w / 2 - min(w, w * (t - 2)),
                    h / 2
                );
            if (t > 3)
                line(
                    -w / 2,
                    h / 2,
                    -w / 2,
                    h / 2 - min(h, h * (t - 3))
                );
        } else if (this.phase === "done" || this.knotProgress >= 1) {
            strokeWeight(13);
            fill(c);
            rect(0, 0, w, h, 4);
        }
    }
}



