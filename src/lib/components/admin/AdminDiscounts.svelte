<!-- src/lib/components/AdminDiscounts.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { config } from "$lib/services/config";
  import type { Product } from "$lib/types/Product";

  type Discount = {
    id?: string;
    code: string;
    description: string;
    percentage: number;
    validUntil: string;
    productId?: string;
    minimumPurchase?: number;
    active: boolean;
  };

  let discounts: Discount[] = [];
  let currentDiscount: Partial<Discount> = { 
    active: true,
    percentage: 10,
    minimumPurchase: 0
  };
  let isEditing = false;
  let products: Product[] = [];
  let currentPage = 1;
  let totalPages = 1;
  
  const baseUrl = config.baseUrl;

  onMount(() => {
    fetchDiscounts();
    fetchProducts();
  });

  const fetchDiscounts = async (page = 1) => {
    try {
      const res = await fetch(`${baseUrl}/discounts?page=${page}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      discounts = data.discounts || data;
      
      // Verificar se o header de paginação existe
      totalPages = Number(res.headers.get("X-Total-Pages")) || 1;
      currentPage = page;
    } catch (err) {
      console.error("Erro ao buscar descontos:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${baseUrl}/products?all=true`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      products = await res.json();
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  const handleSubmit = async () => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${baseUrl}/discounts/${currentDiscount.id}`
      : `${baseUrl}/discounts`;

    // Certifique-se de que a data é uma string ISO
    if (currentDiscount.validUntil) {
      // Se não for uma string ISO, converta
      if (!(currentDiscount.validUntil as string).includes('T')) {
        const date = new Date(currentDiscount.validUntil as string);
        currentDiscount.validUntil = date.toISOString();
      }
    }
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(currentDiscount),
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      await fetchDiscounts(currentPage);
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar desconto:", err);
    }
  };

  const deleteDiscount = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cupom de desconto?")) return;
    
    try {
      const res = await fetch(`${baseUrl}/discounts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      await fetchDiscounts(currentPage);
    } catch (err) {
      console.error("Erro ao excluir desconto:", err);
    }
  };

  const toggleActive = async (discount: Discount) => {
    try {
      const res = await fetch(`${baseUrl}/discounts/${discount.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...discount,
          active: !discount.active
        }),
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      await fetchDiscounts(currentPage);
    } catch (err) {
      console.error("Erro ao atualizar status do desconto:", err);
    }
  };

  const resetForm = () => {
    currentDiscount = { 
      active: true,
      percentage: 10,
      minimumPurchase: 0
    };
    isEditing = false;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Formatar a data para o campo input date
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
</script>

<div class="admin-discounts">
  <section class="form-section">
    <h2>{isEditing ? "Editar Cupom de Desconto" : "Novo Cupom de Desconto"}</h2>
    
    <form on:submit|preventDefault={handleSubmit} class="discount-form">
      <div class="field-row">
        <div class="field-group">
          <label for="code">Código</label>
          <input 
            type="text" 
            id="code" 
            bind:value={currentDiscount.code} 
            placeholder="Ex: BEMVINDO20"
            required 
          />
        </div>
        
        <div class="field-group">
          <label for="percentage">Porcentagem de Desconto</label>
          <input 
            type="number" 
            id="percentage" 
            bind:value={currentDiscount.percentage} 
            min="1" 
            max="100"
            required 
          />
        </div>
      </div>
      
      <div class="field-group">
        <label for="description">Descrição</label>
        <textarea 
          id="description" 
          bind:value={currentDiscount.description} 
          rows="2" 
          placeholder="Ex: Cupom de boas-vindas com 20% de desconto"
          required 
        ></textarea>
      </div>
      
      <div class="field-row">
        <div class="field-group">
          <label for="validUntil">Válido até</label>
          <input 
            type="date" 
            id="validUntil" 
            bind:value={currentDiscount.validUntil} 
            required 
          />
        </div>
        
        <div class="field-group">
          <label for="minimumPurchase">Valor Mínimo de Compra (R$)</label>
          <input 
            type="number" 
            id="minimumPurchase" 
            bind:value={currentDiscount.minimumPurchase} 
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div class="field-row">
        <div class="field-group">
          <label for="product">Produto Aplicável (opcional)</label>
          <select id="product" bind:value={currentDiscount.productId}>
            <option value="">Todos os produtos</option>
            {#each products as product}
              <option value={product.id}>{product.name}</option>
            {/each}
          </select>
        </div>
        
        <div class="field-group checkbox-group">
          <label>
            <input 
              type="checkbox" 
              bind:checked={currentDiscount.active} 
            />
            Cupom Ativo
          </label>
        </div>
      </div>
      
      <div class="actions-row">
        <button type="submit" class="btn save">
          {isEditing ? "Atualizar Cupom" : "Adicionar Cupom"}
        </button>
        {#if isEditing}
          <button type="button" on:click={resetForm} class="btn cancel">
            Cancelar
          </button>
        {/if}
      </div>
    </form>
  </section>
  
  <section class="list-section">
    <h2>Cupons de Desconto</h2>
    
    {#if discounts.length === 0}
      <p class="no-items">Nenhum cupom de desconto cadastrado.</p>
    {:else}
      <div class="discounts-table">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descrição</th>
              <th>Desconto</th>
              <th>Válido até</th>
              <th>Min. Compra</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {#each discounts as discount}
              <tr class:inactive={!discount.active}>
                <td><strong>{discount.code}</strong></td>
                <td>{discount.description}</td>
                <td>{discount.percentage}%</td>
                <td>{formatDate(discount.validUntil)}</td>
                <td>
                  {discount.minimumPurchase 
                    ? `R$ ${Number(discount.minimumPurchase).toFixed(2)}` 
                    : "-"}
                </td>
                <td>
                  <span class="status-indicator" class:active={discount.active}>
                    {discount.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td class="actions">
                  <button 
                    on:click={() => toggleActive(discount)} 
                    class="btn status-toggle"
                    title={discount.active ? "Desativar" : "Ativar"}
                  >
                    {discount.active ? "⏸️" : "▶️"}
                  </button>
                  <button 
                    on:click={() => {
                      currentDiscount = { 
                        ...discount,
                        validUntil: formatDateForInput(discount.validUntil)
                      };
                      isEditing = true;
                    }} 
                    class="btn edit"
                    title="Editar"
                  >
                    ✎
                  </button>
                  <button 
                    on:click={() => deleteDiscount(discount.id as string)} 
                    class="btn delete"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      {#if totalPages > 1}
        <div class="pagination">
          {#each Array(totalPages) as _, i}
            <button
              class:active={i + 1 === currentPage}
              on:click={() => fetchDiscounts(i + 1)}>{i + 1}</button
            >
          {/each}
        </div>
      {/if}
    {/if}
  </section>
</div>

<style>
  .admin-discounts {
    max-width: 1000px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-section, .list-section {
    background: var(--beeswax);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow-small);
  }

  .field-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .field-group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .checkbox-group {
    flex-direction: row;
    align-items: center;
    margin-top: 2.5rem;
  }

  .checkbox-group input[type="checkbox"] {
    margin-right: 0.5rem;
    width: auto;
  }

  .field-group label {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  input, textarea, select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .actions-row {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .btn.save {
    background: var(--success-color);
    color: white;
  }

  .btn.cancel {
    background: #aaa;
    color: white;
  }

  .discounts-table {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 6px;
    overflow: hidden;
  }

  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: var(--primary-color);
    color: white;
    font-weight: 600;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr.inactive {
    background-color: #f9f9f9;
    color: #999;
  }

  .status-indicator {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    background: #f0f0f0;
    color: #777;
  }

  .status-indicator.active {
    background: var(--success-color);
    color: white;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .btn.status-toggle {
    background: #f0f0f0;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .btn.edit {
    background: var(--accent-color);
    color: white;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .btn.delete {
    background: var(--danger-color);
    color: white;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .pagination {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .pagination button {
    padding: 0.5rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }

  .pagination button.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  .no-items {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  @media (max-width: 768px) {
    .field-row {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .checkbox-group {
      margin-top: 0.5rem;
    }
  }
</style>