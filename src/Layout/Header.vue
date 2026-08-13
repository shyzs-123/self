<template>
    <header class="navbar">
        <div class="navbar-logo">GeoSense</div>

        <div class="navbar-search" aria-label="Search area">
            <span class="search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="M16 16l4 4" />
                </svg>
            </span>
            <input class="search-input" type="text" placeholder="Search locations, coords, layers" readonly />
        </div>

        <div class="navbar-right">
            <button class="btn-login" type="button">登录</button>
            <button class="btn-register" type="button">注册</button>
        </div>
    </header>
</template>

<script setup>
</script>

<style scoped>
.navbar {
    height: 60px;
    background: #ffffff;
    color: #1e3a5f;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 28px;
    border-bottom: 1px solid #dbeafe;
    box-shadow: 0 2px 10px rgba(30, 64, 175, 0.08);
}

.navbar-logo {
    flex: 0 0 auto;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0;
    white-space: nowrap;
}

.navbar-search {
    flex: 1 1 auto;
    max-width: 560px;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    margin: 0 auto;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    background: #eff6ff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.navbar-search:focus-within {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

.search-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    color: #3b82f6;
}

.search-icon svg {
    display: block;
    width: 100%;
    height: 100%;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.search-input {
    width: 100%;
    border: 0;
    outline: none;
    background: transparent;
    color: #1e3a5f;
    font-size: 14px;
}

.search-input::placeholder {
    color: #64748b;
}

.navbar-right {
    flex: 0 0 auto;
    display: flex;
    gap: 12px;
}

.navbar-right button {
    height: 40px;
    padding: 0 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.btn-login {
    border: 1px solid #93c5fd;
    background: #ffffff;
    color: #2563eb;
}

.btn-register {
    border: 1px solid #2563eb;
    background: #2563eb;
    color: #ffffff;
}

.btn-login:hover {
    background: #eff6ff;
}

.btn-register:hover {
    border-color: #1d4ed8;
    background: #1d4ed8;
    box-shadow: 0 3px 8px rgba(37, 99, 235, 0.22);
}

.navbar-right button:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

@media (max-width: 900px) {
    .navbar {
        gap: 12px;
        padding: 0 16px;
    }

    .navbar-search {
        max-width: none;
    }
}

@media (max-width: 680px) {
    .navbar {
        flex-wrap: wrap;
        height: auto;
        padding-top: 12px;
        padding-bottom: 12px;
    }

    .navbar-logo,
    .navbar-right {
        width: 100%;
    }

    .navbar-search {
        order: 3;
        width: 100%;
        margin: 0;
    }

    .navbar-right {
        justify-content: flex-end;
    }
}
</style>
