import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome_massa: '',
    tipo_massa: 'fresca',
    quantia: 0,
    em_falta: false
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await fetch(`${API_URL}/produtos`);
      const data = await response.json();
      setProdutos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `${API_URL}/produtos/${editingId}`
        : `${API_URL}/produtos`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchProdutos();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (produto) => {
    setFormData({
      nome_massa: produto.nome_massa,
      tipo_massa: produto.tipo_massa,
      quantia: produto.quantia,
      em_falta: produto.em_falta
    });
    setEditingId(produto.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetch(`${API_URL}/produtos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchProdutos();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome_massa: '',
      tipo_massa: 'fresca',
      quantia: 0,
      em_falta: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>📦 Controle de Estoque</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Adicionar Produto'}
        </button>
      </header>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome da Massa:</label>
              <input
                type="text"
                value={formData.nome_massa}
                onChange={(e) => setFormData({ ...formData, nome_massa: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo de Massa:</label>
              <select
                value={formData.tipo_massa}
                onChange={(e) => setFormData({ ...formData, tipo_massa: e.target.value })}
                required
              >
                <option value="fresca">Fresca</option>
                <option value="congelada">Congelada</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantidade:</label>
              <input
                type="number"
                value={formData.quantia}
                onChange={(e) => setFormData({ ...formData, quantia: parseInt(e.target.value) })}
                min="0"
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.em_falta}
                  onChange={(e) => setFormData({ ...formData, em_falta: e.target.checked })}
                />
                Em Falta
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Atualizar' : 'Salvar'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-list">
        <h2>Produtos em Estoque</h2>
        {produtos.length === 0 ? (
          <p className="empty-message">Nenhum produto cadastrado ainda.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className={produto.em_falta ? 'em-falta' : ''}>
                  <td>{produto.nome_massa}</td>
                  <td>
                    <span className={`badge ${produto.tipo_massa}`}>
                      {produto.tipo_massa === 'congelada' ? '❄️ Congelada' : '🌿 Fresca'}
                    </span>
                  </td>
                  <td>{produto.quantia}</td>
                  <td>
                    {produto.em_falta ? (
                      <span className="status em-falta">⚠️ Em Falta</span>
                    ) : (
                      <span className="status disponivel">✓ Disponível</span>
                    )}
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(produto)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(produto.id)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App

