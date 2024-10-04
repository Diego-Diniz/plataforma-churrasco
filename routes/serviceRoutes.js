const express = require("express");
const Service = require("../models/Service");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const { Op } = require("sequelize");
const User = require("../models/User"); // Certifique-se de que esta linha está presente
const Contract = require('../models/Contract'); // Ajuste o caminho conforme necessário

// Adicionar um novo serviço
router.post("/add-service", authMiddleware, async (req, res) => {
  const { descricao, precoPorHora, disponibilidade } = req.body;
  const prestadorId = req.user.id; // Id do usuário autenticado

  try {
    const service = await Service.create({
      descricao,
      precoPorHora,
      disponibilidade,
      prestadorId,
    });
    res.status(201).json(service);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao adicionar serviço", details: error.message });
  }
});

// Listar serviços de um prestador
router.get("/my-services", authMiddleware, async (req, res) => {
  try {
    const services = await Service.findAll({
      where: {
        prestadorId: req.user.id,
      },
    });
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao listar serviços", details: error.message });
  }
});

// Rota para buscar serviços
router.get("/search-services", async (req, res) => {
  const { query } = req.query; // Pega o termo de busca da query string
  try {
    const services = await Service.findAll({
      where: {
        descricao: {
          [Op.like]: `%${query}%`, // Usando o operador 'like' para procurar descrições que contêm o termo de busca
        },
      },

      // Dentro da rota GET para buscar serviços
      include: [
        {
          model: User,
          as: "Prestador", // Este alias deve corresponder ao definido na associação
          attributes: ["nome", "email", "telefone"],
        },
      ],
    });
    res.json(services);
  } catch (error) {
    console.log(error); // Log do erro para diagnóstico
    res
      .status(500)
      .json({ error: "Erro ao buscar serviços", details: error.message });
  }
});


// Rota para contratar um serviço
router.post('/hire-service', authMiddleware, async (req, res) => {
  const { serviceId, data } = req.body;
  const contratanteId = req.user.id; // ID do usuário autenticado

  try {
      const service = await Service.findByPk(serviceId);
      if (!service) {
          return res.status(404).json({ error: 'Serviço não encontrado' });
      }

      const contract = await Contract.create({
          contratanteId,
          prestadorId: service.prestadorId,
          serviceId,
          data,
          status: 'agendado'
      });

      res.status(201).json({ message: 'Serviço contratado com sucesso', contract });
  } catch (error) {
      res.status(500).json({ error: 'Erro ao contratar serviço', details: error.message });
  }
});

module.exports = router;
