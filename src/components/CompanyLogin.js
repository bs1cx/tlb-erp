export class CompanyLogin {
  constructor(onSuccess) {
    this.onSuccess = onSuccess
    this.render()
    this.attachEvents()
  }

  render() {
    const container = document.getElementById('app') || document.body
    container.innerHTML = `
      <div class="login-container">
        <div class="login-box">
          <div class="login-header">
            <h2><i class="fas fa-building"></i> irket Girii</h2>
            <p class="login-subtitle">thelebois.com ERP Sistemine Ho Geldiniz</p>
          </div>
          
          <form id="companyLoginForm" class="login-form">
            <div class="form-group">
              <label for="companyCode">irket Kodu:</label>
              <input type="text" id="companyCode" required placeholder="Örn: ABC123 veya DEF456" value="ABC123">
              <small class="form-hint">Demo kodlar: ABC123 (Enterprise) veya DEF456 (Premium)</small>
            </div>
            
            <div class="form-group">
              <label for="username">Kullanc Ad:</label>
              <input type="text" id="username" required placeholder="admin veya user" value="admin">
              <small class="form-hint">Demo kullanclar: admin / user</small>
            </div>
            
            <div class="form-group">
              <label for="password">ifre:</label>
              <input type="password" id="password" required placeholder="admin123 veya user123" value="admin123">
              <small class="form-hint">Demo ifreler: admin123 / user123</small>
            </div>
            
            <button type="submit" class="login-btn">
              <i class="fas fa-sign-in-alt"></i> Giri Yap
            </button>
          </form>
          
          <div id="loginMessage" class="message"></div>
          
          <div class="demo-info">
            <h4><i class="fas fa-info-circle"></i> Demo Bilgileri:</h4>
            <div class="demo-company">
              <strong>ABC123 - Enterprise Plan</strong>
              <p> Tüm modüllere eriim</p>
              <p> Kullanc: admin / admin123</p>
              <p> Kullanc: user / user123</p>
            </div>
            <div class="demo-company">
              <strong>DEF456 - Premium Plan</strong>
              <p> Snrl modül eriimi</p>
              <p> Kullanc: admin / admin123</p>
              <p> Kullanc: user / user123</p>
            </div>
          </div>

          <div class="login-footer">
            <p>TLB ERP Multi-Company System © 2024</p>
          </div>
        </div>
      </div>
    `
  }

  attachEvents() {
    const form = document.getElementById('companyLoginForm')
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const companyCode = document.getElementById('companyCode').value.trim()
      const username = document.getElementById('username').value.trim()
      const password = document.getElementById('password').value

      const loginBtn = form.querySelector('button')
      const originalText = loginBtn.textContent
      loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giri yaplyor...'
      loginBtn.disabled = true

      const messageDiv = document.getElementById('loginMessage')
      messageDiv.innerHTML = '<div class="info-message"><i class="fas fa-spinner fa-spin"></i> Giri yaplyor...</div>'

      try {
        const { authService } = await import('../services/authService.js')
        
        // Demo data'y initialize et (ilk giri için)
        authService.initializeDemoData(companyCode)
        
        const result = await authService.login(companyCode, username, password)
        
        if (result.success) {
          messageDiv.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i> Giri baarl! Yönlendiriliyorsunuz...</div>'
          setTimeout(() => {
            if (this.onSuccess) {
              this.onSuccess(result.company, result.user)
            }
          }, 1500)
        } else {
          messageDiv.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> Hata: ${result.error}</div>`
        }
      } catch (error) {
        messageDiv.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Sistem hatas: ${error.message}</div>`
        console.error('Login error:', error)
      } finally {
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Giri Yap'
        loginBtn.disabled = false
      }
    })
  }

  // Static method for quick initialization
  static initialize(onSuccess) {
    return new CompanyLogin(onSuccess)
  }
}
