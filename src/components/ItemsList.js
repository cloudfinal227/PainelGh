import { Trash2 } from "lucide-react";

const ItemsList = ({ items, onRemoveItem }) => {
  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatQuantity = (item) => {
    const { quantity, unit } = item;
    if (unit === "metro" && quantity < 1) {
      return `${quantity} ${unit} (${quantity * 100}cm)`;
    }
    return `${quantity} ${unit}${quantity > 1 && unit !== "metro" ? "s" : ""}`;
  };

  if (items.length === 0) {
    return (
      <div className="form-section">
        <h3>Itens do Pedido</h3>
        <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>
          Nenhum item adicionado ainda. Use o formulário acima para adicionar
          materiais.
        </p>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h3>
        Itens do Pedido ({items.length} {items.length === 1 ? "item" : "itens"})
      </h3>

      <div style={{ overflowX: "auto" }}>
        <table className="items-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantidade</th>
              <th>Tipo Medida</th>
              <th>Veículo</th>
              <th>Preço Unit.</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.materialName}</strong>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    ID: {item.materialId}
                  </div>
                </td>
                <td>{formatQuantity(item)}</td>
                <td>
                  <span
                    style={{
                      padding: "2px 6px",
                      backgroundColor: item.measureType === "metro" ? "#dbeafe" : "#f3f4f6",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: item.measureType === "metro" ? "#1e40af" : "#374151"
                    }}
                  >
                    {item.measureType === "metro" ? "Metro" : "Quantidade"}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.vehicleName}
                  </span>
                </td>
                <td>{formatCurrency(item.unitPrice)}</td>
                <td>
                  <strong>{formatCurrency(item.totalPrice)}</strong>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => onRemoveItem(item.id)}
                    style={{ padding: "5px 8px", fontSize: "12px" }}
                    title="Remover item"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="total-section">
        <div style={{ marginBottom: "10px" }}>
          <strong>Total de Itens: {items.length}</strong>
        </div>
        <div className="total-value">Total: {formatCurrency(totalValue)}</div>
      </div>
    </div>
  );
};

export default ItemsList;
