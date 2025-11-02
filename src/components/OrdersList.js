import { useState, useEffect, useRef } from "react";
import { orderService } from "../services/orderService";
import {
  Package,
  User,
  MapPin,
  Phone,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { REALTIME_CONFIG, REFRESH_MESSAGES } from "../config/realtime";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const intervalRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    loadOrders();
    setupRealTimeUpdates();
    setupAutoRefresh();

    // Cleanup ao desmontar o componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setIsUpdating(true);
    }

    try {
      const result = await orderService.getOrders();
      if (result.success) {
        setOrders(result.data);
        setError(null);
        setLastUpdate(new Date());
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Erro ao carregar pedidos");
    } finally {
      if (showLoading) {
        setLoading(false);
      } else {
        setIsUpdating(false);
      }
    }
  };

  // Configurar atualizações em tempo real via Supabase Realtime
  const setupRealTimeUpdates = () => {
    try {
      const subscription = supabase
        .channel(REALTIME_CONFIG.SUPABASE_CHANNEL)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "pedidos",
          },
          (payload) => {
            console.log("Mudança detectada nos pedidos:", payload);
            setRealtimeConnected(true);
            // Recarregar dados sem mostrar loading
            loadOrders(false);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "pedido_itens",
          },
          (payload) => {
            console.log("Mudança detectada nos itens:", payload);
            setRealtimeConnected(true);
            // Recarregar dados sem mostrar loading
            loadOrders(false);
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setRealtimeConnected(true);
            console.log("Realtime conectado com sucesso");
          } else if (status === "CHANNEL_ERROR") {
            setRealtimeConnected(false);
            console.log("Erro na conexão realtime, usando auto-refresh");
          }
        });

      subscriptionRef.current = subscription;
    } catch (error) {
      console.log("Realtime não disponível, usando apenas auto-refresh");
      setRealtimeConnected(false);
    }
  };

  // Configurar auto-refresh
  const setupAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (isAutoRefreshing) {
        loadOrders(false);
      }
    }, REALTIME_CONFIG.AUTO_REFRESH_INTERVAL);
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefreshing(!isAutoRefreshing);
    if (!isAutoRefreshing) {
      setupAutoRefresh();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const formatAddress = (order) => {
    // Como o endereço agora está em campos separados
    const parts = [];

    if (order.rua) parts.push(order.rua);
    if (order.numero) parts.push(`nº ${order.numero}`);
    if (order.bairro) parts.push(order.bairro);
    if (order.cidade) parts.push(order.cidade);

    return parts.join(", ");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "#f59e0b"; // Amarelo vibrante para pendente
      case "entregue":
        return "#059669"; // Verde mais forte para entregue/concluído
      case "cancelado":
        return "#dc2626"; // Vermelho mais forte para cancelado
      default:
        return "#f59e0b"; // Amarelo como padrão (pendente)
    }
  };

  const getStatusBackground = (status) => {
    switch (status) {
      case "pendente":
        return "#fef3c7"; // Fundo amarelo claro
      case "entregue":
        return "#d1fae5"; // Fundo verde claro
      case "cancelado":
        return "#fee2e2"; // Fundo vermelho claro
      default:
        return "#fef3c7"; // Fundo amarelo claro como padrão
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "entregue":
        return "Entregue";
      case "cancelado":
        return "Cancelado";
      default:
        return status || "Pendente";
    }
  };

  // Função removida - status será controlado pelo aplicativo do entregador

  if (loading) {
    return (
      <div className="form-section">
        <h3>Pedidos Registrados</h3>
        <p style={{ textAlign: "center", padding: "20px" }}>
          Carregando pedidos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-section">
        <h3>Pedidos Registrados</h3>
        <p style={{ textAlign: "center", padding: "20px", color: "#ef4444" }}>
          Erro: {error}
        </p>
        <button className="btn btn-primary" onClick={loadOrders}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="form-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3>Pedidos Registrados ({orders.length})</h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <span>Status controlado pelo aplicativo do entregador</span>
            <span>•</span>
            <span>
              Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
            </span>
            <span>•</span>
            <span style={{ color: realtimeConnected ? "#059669" : "#f59e0b" }}>
              {realtimeConnected
                ? REFRESH_MESSAGES.REALTIME_CONNECTED
                : REFRESH_MESSAGES.REALTIME_DISCONNECTED}
            </span>
            {isAutoRefreshing && (
              <>
                <span>•</span>
                <span style={{ color: "#059669" }}>
                  {isUpdating
                    ? REFRESH_MESSAGES.UPDATING
                    : REFRESH_MESSAGES.ACTIVE}
                </span>
              </>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className={`btn ${
              isAutoRefreshing ? "btn-success" : "btn-primary"
            }`}
            onClick={toggleAutoRefresh}
            style={{ fontSize: "12px", padding: "6px 12px" }}
          >
            {isAutoRefreshing ? "⏸️ Pausar" : "▶️ Ativar"} Auto-refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => loadOrders(true)}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <RefreshCw size={16} />
            Atualizar Agora
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          Nenhum pedido encontrado.
        </p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#fff",
              }}
            >
              {/* Cabeçalho do pedido */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div>
                  <h4 style={{ margin: 0 }}>Pedido #{order.id}</h4>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Calendar size={12} />
                    {formatDate(order.created_at)}
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: getStatusBackground(order.status),
                      color: getStatusColor(order.status),
                      border: `1px solid ${getStatusColor(order.status)}30`,
                    }}
                  >
                    {getStatusText(order.status)}
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#059669",
                    }}
                  >
                    {formatCurrency(order.total_pedido)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "15px",
                }}
              >
                {/* Dados do Cliente */}
                <div>
                  <h5
                    style={{
                      margin: "0 0 8px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <User size={16} />
                    Cliente
                  </h5>
                  <div style={{ fontSize: "14px", color: "#374151" }}>
                    <div>
                      <strong>{order.cliente_nome}</strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Phone size={12} />
                      {order.telefone}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <MapPin size={12} />
                      {formatAddress(order)}
                    </div>
                    {order.observacoes && (
                      <div style={{ marginTop: "5px", fontStyle: "italic" }}>
                        "{order.observacoes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div>
                  <h5
                    style={{
                      margin: "0 0 8px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Package size={16} />
                    Itens ({order.pedido_itens?.length || 0})
                  </h5>
                  <div
                    style={{
                      fontSize: "14px",
                      maxHeight: "120px",
                      overflowY: "auto",
                    }}
                  >
                    {order.pedido_itens?.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "5px 0",
                          borderBottom:
                            index < order.pedido_itens.length - 1
                              ? "1px solid #f3f4f6"
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>
                            <strong>
                              {item.materiais?.nome || "Material"}
                            </strong>
                          </span>
                          <span>{formatCurrency(item.total_item)}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {item.quantidade}{" "}
                          {item.materiais?.tipo_medida || "unidade"} -{" "}
                          {item.tipo_medida_usado === "metro"
                            ? "Por metro"
                            : "Por quantidade"}
                          <span
                            style={{
                              marginLeft: "8px",
                              padding: "2px 6px",
                              fontSize: "10px",
                              backgroundColor: "#dbeafe",
                              color: "#1e40af",
                              borderRadius: "4px",
                            }}
                          >
                            {item.veiculos?.nome || "Veículo"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status controlado pelo aplicativo do entregador */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
