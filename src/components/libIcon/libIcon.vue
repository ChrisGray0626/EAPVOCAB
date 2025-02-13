<template>
    <div class="icon-container">

      <div class="icon-text">{{ libName }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: "IconComponent",
    props: {
        libName: {
            type: String,
            required: true,
        },
    },
  };
  </script>
  
  <style scoped>
  .icon-container {
    position: relative;
    width: 110px; /* Adjust size as needed */
    height: 150px; /* Adjust size as needed */
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #725aff 0%, #65b3ff 100%);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 30px), 0 100%);
    border-radius: 10px;
    overflow: hidden;
  }
  
  .icon-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .icon-text {
    position: absolute;
    top: 30%;
    color: white;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }

  @media (max-width: 410px) {
    .icon-container {
      position: relative;
      width: 100px;
    }
  }

  </style>
  