import * as VendaService from '../services/VendaService.js';

export const registrarVenda = async (req, res) => {
  try {
    const { produtoId, quantidade } = req.body;
    const venda = await VendaService.registrarVenda(produtoId, quantidade, req.userId);
    res.status(201).json(venda);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

export const listar = async (req, res) => {
  try {
    const filtros = {
      dataInicio: req.query.dataInicio,
      dataFim: req.query.dataFim
    };
    const vendas = await VendaService.listarVendas(req.userId, filtros);
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const venda = await VendaService.buscarVendaPorId(req.params.id, req.userId);
    res.json(venda);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
};
