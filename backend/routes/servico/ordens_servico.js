const express = require('express');
const router = express.Router();
const pool = require('../../bd/bd');

// GET todas ordens
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.*,
        c.nome_razao AS cliente_nome,
        c.telefone AS cliente_telefone,
        col.nome AS colaborador_nome,
        s.descricao AS procedimento
      FROM ordens_servico o
      JOIN clientes c 
        ON o.cliente_id = c.id
      JOIN colaboradores col 
        ON o.colaborador_id = col.id
      JOIN servico s 
        ON o.servico_id = s.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar OSs' });
  }
});


module.exports = router;