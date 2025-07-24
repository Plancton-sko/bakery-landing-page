<!-- src/lib/components/AdminDashboard.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { config } from "$lib/services/config";

  type DashboardStats = {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    recentOrders: any[];
    topProducts: any[];
  };

  let stats: DashboardStats = {
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
  };

  let loading = true;

  const baseUrl = config.baseUrl;

  onMount(async () => {
    await fetchDashboardData();
    loading = false;
  });

  const fetchDashboardData = async () => {
    try {
      // Tentativa de buscar dados estatísticos do backend
      const res = await fetch(`${baseUrl}/dashboard/stats`, {
        credentials: "include",
      });

      if (res.ok) {
        stats = await res.json();
      } else {
        // Se o endpoint ainda não existe, use dados simulados
        simulateDashboardData();
      }
    } catch (err) {
      console.error("Erro ao buscar dados do dashboard:", err);
      // Em caso de erro, também usa dados simulados
      simulateDashboardData();
    }
  };

  // FIXME: Função para simular dados enquanto o backend não está disponível
  const simulateDashboardData = () => {
    stats = {
      totalProducts: 24,
      totalOrders: 158,
      totalCustomers: 87,
      recentOrders: [
        {
          id: "ORD-2023-001",
          customer: "José Silva",
          total: 48.9,
          date: "2025-05-12",
          status: "delivered",
        },
        {
          id: "ORD-2023-002",
          customer: "Maria Oliveira",
          total: 32.5,
          date: "2025-05-12",
          status: "processing",
        },
        {
          id: "ORD-2023-003",
          customer: "João Pereira",
          total: 75.2,
          date: "2025-05-11",
          status: "pending",
        },
        {
          id: "ORD-2023-004",
          customer: "Ana Santos",
          total: 19.8,
          date: "2025-05-11",
          status: "delivered",
        },
        {
          id: "ORD-2023-005",
          customer: "Carlos Lima",
          total: 54.6,
          date: "2025-05-10",
          status: "canceled",
        },
      ],
      topProducts: [
        { name: "Pão Francês", sales: 243, revenue: 729.0 },
        { name: "Café Especial", sales: 187, revenue: 1122.0 },
        { name: "Bolo de Chocolate", sales: 132, revenue: 2640.0 },
        { name: "Croissant", sales: 116, revenue: 812.0 },
        { name: "Cookie de Baunilha", sales: 98, revenue: 392.0 },
      ],
    };
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "delivered":
        return "status-delivered";
      case "processing":
        return "status-processing";
      case "pending":
        return "status-pending";
      case "canceled":
        return "status-canceled";
      default:
        return "";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "delivered":
        return "Entregue";
      case "processing":
        return "Em Processamento";
      case "pending":
        return "Pendente";
      case "canceled":
        return "Cancelado";
      default:
        return status;
    }
  };
</script>

<div class="dashboard">
  {#if loading}
    <div class="loading">Carregando dados do dashboard...</div>
  {:else}
    <!-- Cards de estatísticas -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon products">📦</div>
        <div class="stat-content">
          <h3>Produtos</h3>
          <p class="stat-value">{stats.totalProducts}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orders">🛒</div>
        <div class="stat-content">
          <h3>Pedidos</h3>
          <p class="stat-value">{stats.totalOrders}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon customers">👤</div>
        <div class="stat-content">
          <h3>Clientes</h3>
          <p class="stat-value">{stats.totalCustomers}</p>
        </div>
      </div>
    </div>

    <!-- Atalhos para seções principais -->
    <div class="shortcuts">
      <h2>Acesso Rápido</h2>
      <div class="shortcut-cards">
        <a href="/admin/products" class="shortcut-card">
          <div class="shortcut-icon">🥖</div>
          <h3>Produtos</h3>
          <p>Gerencie seus produtos e categorias</p>
        </a>

        <a href="/admin/orders" class="shortcut-card">
          <div class="shortcut-icon">📋</div>
          <h3>Pedidos</h3>
          <p>Visualize e processe pedidos</p>
        </a>

        <a href="/admin/discounts" class="shortcut-card">
          <div class="shortcut-icon">🏷️</div>
          <h3>Cupons</h3>
          <p>Crie e gerencie cupons de desconto</p>
        </a>

        <a href="/admin/slides" class="shortcut-card">
          <div class="shortcut-icon">🖼️</div>
          <h3>Slides</h3>
          <p>Atualize o carrossel da página inicial</p>
        </a>
      </div>
    </div>

    <!-- Pedidos Recentes -->
    <div class="recent-section">
      <h2>Pedidos Recentes</h2>
      <div class="recent-orders">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {#each stats.recentOrders as order}
              <tr>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{formatDate(order.date)}</td>
                <td>R$ {order.total.toFixed(2)}</td>
                <td>
                  <span class={`status-badge ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Produtos Mais Vendidos -->
    <div class="top-section">
      <h2>Produtos Mais Vendidos</h2>
      <div class="top-products">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Vendas</th>
              <th>Receita</th>
            </tr>
          </thead>
          <tbody>
            {#each stats.topProducts as product}
              <tr>
                <td>{product.name}</td>
                <td>{product.sales} un.</td>
                <td>R$ {product.revenue.toFixed(2)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    padding: 1rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #666;
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
  }

  .stat-icon {
    font-size: 2rem;
    margin-right: 1rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .stat-icon.products {
    background-color: #e3f2fd;
    color: #1976d2;
  }

  .stat-icon.orders {
    background-color: #e8f5e9;
    color: #388e3c;
  }

  .stat-icon.customers {
    background-color: #fff8e1;
    color: #ffa000;
  }

  .stat-content h3 {
    margin: 0;
    font-size: 1rem;
    color: #666;
  }

  .stat-value {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0.3rem 0 0;
    color: #333;
  }

  .shortcuts {
    margin-bottom: 2rem;
  }

  .shortcuts h2,
  .recent-section h2,
  .top-section h2 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }

  .shortcut-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .shortcut-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 1.2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: inherit;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    text-align: center;
  }

  .shortcut-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .shortcut-icon {
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }

  .shortcut-card h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }

  .shortcut-card p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }

  .recent-section,
  .top-section {
    background-color: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.8rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    font-weight: 600;
    color: #555;
  }

  .status-badge {
    padding: 0.3rem 0.6rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .status-delivered {
    background-color: #e8f5e9;
    color: #388e3c;
  }

  .status-processing {
    background-color: #e3f2fd;
    color: #1976d2;
  }

  .status-pending {
    background-color: #fff8e1;
    color: #ffa000;
  }

  .status-canceled {
    background-color: #ffebee;
    color: #d32f2f;
  }
</style>
