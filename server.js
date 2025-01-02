import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { db } from "./lib/db.js"

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 4000;

// Inicializa la app de Next.js
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Ajusta según tus necesidades
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
  
    try {
      // Verifica que la consulta a la base de datos esté funcionando correctamente
      console.log("Consultando datos...");
      const gastos = await db.gasto.findMany();
      const ventas = await db.venta.findMany();
      const productos = await db.producto.findMany();
      
      console.log("Datos obtenidos, enviando al cliente");
      socket.emit("initialData", { gastos, ventas, productos });
    } catch (error) {
      console.error("Error fetching data:", error);
      socket.emit("error", { message: "Failed to fetch data" });
    }
  
    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
  

  // Manejo de errores del servidor HTTP
  httpServer.once("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  // Inicia el servidor
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
