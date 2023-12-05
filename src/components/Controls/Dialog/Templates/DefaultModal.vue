<template>
  <!-- Main modal -->
  <div
    tabindex="-1"
    aria-hidden="true"
    class="q-hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
  >
    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
      <!-- Modal content -->
      <div class="q-relative q-p-4 q-bg-white q-rounded-lg q-shadow dark:bg-gray-800 sm:q-p-5">
        <!-- Modal header -->
        <div
          class="q-flex q-justify-between q-items-center pb-4 mb-4 q-rounded-t q-border-b sm:mb-5 dark:border-gray-600"
        >
          <h3 class="q-text-lg q-font-semibold q-text-gray-900 dark:text-white">Update Product</h3>
          <button
            type="button"
            class="q-text-gray-400 q-bg-transparent q-hover:bg-gray-200 q-hover:text-gray-900 q-rounded-lg q-text-sm q-p-1.5 q-ml-auto q-inline-flex q-items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="updateProductModal"
          >
            <span>Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <form action="#">
          <div class="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Name</label
              >
              <input
                type="text"
                name="name"
                id="name"
                value="iPad Air Gen 5th Wi-Fi"
                class="q-grid gap-4 mb-4 sm:grid-cols-2"
                placeholder="Ex. Apple iMac 27&ldquo;"
              />
            </div>
            <div>
              <label
                for="brand"
                class="q-block q-mb-2 q-text-sm q-font-medium q-text-gray-900 dark:text-white"
                >Brand</label
              >
              <input
                type="text"
                name="brand"
                id="brand"
                value="Google"
                class="q-bg-gray-50 q-border q-border-gray-300 q-text-gray-900 q-text-sm q-rounded-lg q-focus:ring-primary-600 q-focus:border-primary-600 q-block w-full q-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Ex. Apple"
              />
            </div>
            <div>
              <label
                for="price"
                class="q-block q-mb-2 q-text-sm q-font-medium q-text-gray-900 dark:text-white"
                >Price</label
              >
              <input
                type="number"
                value="399"
                name="price"
                id="price"
                class="q-bg-gray-50 q-border q-border-gray-300 q-text-gray-900 q-text-sm q-rounded-lg q-focus:ring-primary-600 q-focus:border-primary-600 q-block w-full q-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="$299"
              />
            </div>
            <div>
              <label
                for="category"
                class="q-block q-mb-2 q-text-sm q-font-medium q-text-gray-900 dark:text-white"
                >Category</label
              >
              <select
                id="category"
                class="q-bg-gray-50 q-border q-border-gray-300 q-text-gray-900 q-text-sm q-rounded-lg q-focus:ring-primary-600 q-focus:border-primary-600 q-block w-full q-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option selected="">Electronics</option>
                <option value="TV">TV/Monitors</option>
                <option value="PC">PC</option>
                <option value="GA">Gaming/Console</option>
                <option value="PH">Phones</option>
              </select>
            </div>
            <div>
              <label
                for="description"
                class="q-block q-mb-2 q-text-sm q-font-medium q-text-gray-900 dark:text-white"
                >Description</label
              >
              <textarea
                id="description"
                rows="5"
                class="q-bg-gray-50 q-border q-border-gray-300 q-text-gray-900 q-text-sm q-rounded-lg q-focus:ring-primary-500 q-focus:border-primary-500 q-block w-full q-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Write a description..."
              >
Standard glass, 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US</textarea
              >
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              type="submit"
              class="q-block q-mb-2 q-text-sm q-font-medium q-text-gray-900 dark:text-white"
            >
              Update product
            </button>
            <button
              type="button"
              class="q-block q-p-2.5 w-full q-text-sm q-text-gray-900 q-bg-gray-50 q-rounded-lg q-border q-border-gray-300 q-focus:ring-primary-500 q-focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <svg
                class="mr-1 -ml-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang=""></style>
