const http = require('http');

let students = [
  { id: 1, name: 'John Doe', age: 16, class: '10A' },
  { id: 2, name: 'Jane Doe', age: 17, class: '11B' }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Route GET /students - Ambil semua data siswa
  if (url === '/students' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(students));
  }

  // Route POST /students - Tambah siswa baru
  else if (url === '/students' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newStudent = JSON.parse(body);
      newStudent.id = students.length + 1; // Atur ID siswa secara otomatis
      students.push(newStudent);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newStudent));
    });
  }

  // Route PUT /students/:id - Update siswa berdasarkan ID
  else if (url.startsWith('/students/') && method === 'PUT') {
    const id = parseInt(url.split('/')[2]); // Ambil ID dari URL
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const updatedStudent = JSON.parse(body);
      const index = students.findIndex(student => student.id === id);
      if (index !== -1) {
        students[index] = { id, ...updatedStudent };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(students[index]));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Student not found' }));
      }
    });
  }

  // Route DELETE /students/:id - Hapus siswa berdasarkan ID
  else if (url.startsWith('/students/') && method === 'DELETE') {
    const id = parseInt(url.split('/')[2]);
    const index = students.findIndex(student => student.id === id);
    if (index !== -1) {
      students.splice(index, 1);
      res.writeHead(204); // No content
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Student not found' }));
    }
  }

  // Jika route tidak ditemukan
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Jalankan server di port 3000
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
