// --- FUNCTION TO GENERATE THE WORD SEARCH AUTOMATICALLY ---
export const generateWordSearchGrid = (wordsList) => {
  const GRID_SIZE = 10;
  
  let grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));

  
  const directions = [
    { r: 0, c: 1 },   
    { r: 1, c: 0 },   
    { r: 1, c: 1 }    
  ];

  // 2. We insert each vocabulary word into the grid
  wordsList.forEach(item => {
    let word = item.english_word.toUpperCase().replace(/[^A-Z]/g, '');
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      let dir = directions[Math.floor(Math.random() * directions.length)];
      let row = Math.floor(Math.random() * GRID_SIZE);
      let col = Math.floor(Math.random() * GRID_SIZE);

      // We check if possible at the chosen address
      let endRow = row + dir.r * (word.length - 1);
      let endCol = col + dir.c * (word.length - 1);

      if (endRow >= 0 && endRow < GRID_SIZE && endCol >= 0 && endCol < GRID_SIZE) {
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          let currR = row + dir.r * i;
          let currC = col + dir.c * i;
          if (grid[currR][currC] !== '' && grid[currR][currC] !== word[i]) {
            fits = false;
            break;
          }
        }

        // If possible, we place it letter by letter
        if (fits) {
          for (let i = 0; i < word.length; i++) {
            grid[row + dir.r * i][col + dir.c * i] = word[i];
          }
          placed = true;
        }
      }
    }
  });

  // 3. Fill in the empty spaces with random letters of the alphabet
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return grid;
};
