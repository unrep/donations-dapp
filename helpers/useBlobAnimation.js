function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

class Blob {
  constructor(el) {
    this.el = el;
    const boundingRect = this.el.getBoundingClientRect();
    this.size = boundingRect.width;
    this.initialX = randomNumber(0, window.innerWidth - this.size);
    this.initialY = randomNumber(0, window.innerHeight - this.size);
    this.el.style.top = `${this.initialY}px`;
    this.el.style.left = `${this.initialX}px`;

    this.updateSpeed();

    this.x = this.initialX;
    this.y = this.initialY;
  }

  updateSpeed() {
    const screenSize = window.innerWidth;
    if (screenSize < 768) {
      this.minSpeed = 0.5;
      this.maxSpeed = 1.2;
    } else if (screenSize >= 768 && screenSize < 1200) {
      this.minSpeed = 1.0;
      this.maxSpeed = 1.8;
    } else {
      this.minSpeed = 1.5;
      this.maxSpeed = 2.5;
    }

    this.vx =
      randomNumber(this.minSpeed, this.maxSpeed) *
      (Math.random() > 0.5 ? 1 : -1);
    this.vy =
      randomNumber(this.minSpeed, this.maxSpeed) *
      (Math.random() > 0.5 ? 1 : -1);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x >= window.innerWidth - this.size) {
      this.x = window.innerWidth - this.size;
      this.vx *= -1;
    }
    if (this.y >= window.innerHeight - this.size) {
      this.y = window.innerHeight - this.size;
      this.vy *= -1;
    }
    if (this.x <= 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (this.y <= 0) {
      this.y = 0;
      this.vy *= -1;
    }
  }

  move() {
    this.el.style.transform = `translate(${this.x - this.initialX}px, ${this.y - this.initialY}px)`;
  }
}

export function initBlobs() {
  const blobEls = document.querySelectorAll(".bouncing-blob");
  const blobs = Array.from(blobEls).map((blobEl) => new Blob(blobEl));

  function handleResize() {
    blobs.forEach((blob) => blob.updateSpeed());
  }

  window.addEventListener("resize", handleResize);

  function update() {
    requestAnimationFrame(update);
    blobs.forEach((blob) => {
      blob.update();
      blob.move();
    });
  }

  requestAnimationFrame(update);
}
