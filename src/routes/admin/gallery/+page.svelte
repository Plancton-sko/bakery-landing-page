<script lang="ts">
  import ImageGallery from '$lib/components/admin/ImageGallery.svelte';

  const handleImagesSelected = (images) => {
    // Apenas logar ou usar no futuro
    console.log('Imagens selecionadas:', images);
  };
</script>

<h1>Gerenciador de Galeria</h1>

<ImageGallery
  onSelectImage={handleImagesSelected}
  showUpload={true}
  allowMultiSelect={true}
/>
