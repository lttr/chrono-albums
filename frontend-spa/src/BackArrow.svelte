<script>

</script>

<style>
  i {
    color: #3c4859;
  }
  .icon {
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 22px;
    height: 22px;
    transform: scale(2);
  }
  .icon::after,
  .icon::before {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    left: 4px;
  }
  .icon::after {
    width: 6px;
    height: 6px;
    border-bottom: 2px solid;
    border-left: 2px solid;
    transform: rotate(45deg);
    bottom: 6px;
  }
  .icon::before {
    width: 10px;
    height: 2px;
    bottom: 8px;
    background: currentColor;
  }
</style>

<i class="icon" />
