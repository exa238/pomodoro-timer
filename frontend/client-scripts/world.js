fetch("/api/world")
  .then(res => res.json())
  .then(world => {
    const grid = document.getElementById("world-grid");

    for (let i = 0; i < world.trees; i++) {
      const tree = document.createElement("div");
      tree.textContent = "🌳";
      tree.style.fontSize = "2rem";
      grid.appendChild(tree);
    }

    for (let i = 0; i < world.buildings; i++) {
      const b = document.createElement("div");
      b.textContent = "🏠";
      b.style.fontSize = "2rem";
      grid.appendChild(b);
    }

    for (let i = 0; i < world.stars; i++) {
      const s = document.createElement("div");
      s.textContent = "⭐";
      s.style.fontSize = "2rem";
      grid.appendChild(s);
    }
  });
