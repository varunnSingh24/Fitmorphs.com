import os

files = [
    'blog.html',
    'how-to-reduce-hba1c-naturally.html',
    'can-type-2-diabetes-be-reversed.html',
    'best-diet-plan-for-diabetes-reversal.html',
    'how-to-control-blood-sugar-without-medicine.html',
    'foods-to-avoid-in-diabetes.html',
    'best-breakfast-for-diabetics.html',
    'can-prediabetes-be-reversed.html',
    'natural-treatment-for-insulin-resistance.html',
    'diabetes-reversal-program-india.html',
    'how-to-lower-blood-sugar-naturally.html'
]

body_start_replacement = """<body>
    <div class="scroll-progress-container" aria-hidden="true"><div class="scroll-progress-bar"></div></div>
    <div class="custom-cursor" aria-hidden="true"></div>
    <div id="page-wipe" aria-hidden="true"></div>
"""

# Adding fade-in-section to elements
header_replacement = '<header class="blog-header fade-in-section">'
main_replacement = '<main class="blog-content-wrapper fade-in-section">'

# Footer and float injection before scripts
script_replacement = """
    <!-- FOOTER -->
    <footer style="background-color:var(--dark-deep); padding: 5rem 0 2rem; border-top:1px solid rgba(212,160,23,0.15); color:var(--cream); font-family:'DM Sans', sans-serif;">
        <div class="container">
            <div style="display:grid; grid-template-columns: 1.2fr 1fr 1fr; gap:3rem; margin-bottom:4rem;" class="footer-grid fade-in-section">
                <div>
                    <img src="logo_stickey.png" alt="FitMorphs Logo" width="70" height="70" loading="lazy" style="margin-bottom:1.5rem;">
                    <p style="opacity:0.6; font-size:0.95rem;">Body. Mind. Soul.<br>Transform From Within.</p>
                </div>
                <div>
                    <h4 style="color:var(--gold-mid); text-transform:uppercase; letter-spacing:2px; font-size:0.85rem; margin-bottom:1.5rem; font-weight:700;">Quick Links</h4>
                    <ul style="list-style:none; padding:0; margin:0; line-height:2.2;">
                        <li><a href="index.html" style="color:rgba(245,239,227,0.7); text-decoration:none;">Home</a></li>
                        <li><a href="diabetes.html" style="color:rgba(245,239,227,0.7); text-decoration:none;">Diabetes Reversal</a></li>
                        <li><a href="transformation.html" style="color:rgba(245,239,227,0.7); text-decoration:none;">Transformation</a></li>
                        <li><a href="results.html" style="color:rgba(245,239,227,0.7); text-decoration:none;">Results</a></li>
                        <li><a href="about.html" style="color:rgba(245,239,227,0.7); text-decoration:none;">About Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color:var(--gold-mid); text-transform:uppercase; letter-spacing:2px; font-size:0.85rem; margin-bottom:1.5rem; font-weight:700;">Contact</h4>
                    <ul style="list-style:none; padding:0; margin:0; line-height:2.2;">
                        <li><a href="tel:+918208692210" style="color:rgba(245,239,227,0.7); text-decoration:none;">+91 8208692210</a></li>
                        <li><a href="mailto:hello@fitmorphs.com" style="color:rgba(245,239,227,0.7); text-decoration:none;">hello@fitmorphs.com</a></li>
                    </ul>
                    <div style="margin-top: 2rem;">
                        <a href="apply.html" class="btn btn-outline" style="padding: 0.8rem 2rem; border-color:var(--gold-mid); color:var(--gold-mid);">Apply Now</a>
                    </div>
                </div>
            </div>
            <div style="text-align:center; padding-top:2rem; border-top:1px solid rgba(255,255,255,0.05); font-size:0.85rem; opacity:0.5;">
                <p>&copy; 2025 FitMorphs Health Technologies Pvt. Ltd. All Rights Reserved. | <a href="javascript:void(0)" style="text-decoration: underline;">Disclaimer</a></p>
            </div>
        </div>
    </footer>
    
    <style> @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr; gap: 2.5rem; } } </style>

    <!-- Floating Apply Now -->
    <div class="apply-float">
        <a href="apply.html" class="apply-float-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Apply Now
        </a>
    </div>

    <!-- WhatsApp -->
    <a href="https://wa.me/918208692210" class="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
    </a>

    <script src="script.js"></script>
"""

for file in files:
    if os.path.exists(file):
        with open(file, 'r') as f:
            content = f.read()
        
        # 1. Add page-wipe and cursor
        content = content.replace('<body>', body_start_replacement)
        
        # 2. Add fade-in to header
        content = content.replace('<header class="blog-header">', header_replacement)
        
        # 3. Add fade-in to main wrapping
        content = content.replace('<main class="blog-content-wrapper">', main_replacement)
        
        # 4. Add fade-in to CTA sections
        content = content.replace('<div class="blog-cta-section">', '<div class="blog-cta-section fade-in-section">')
        
        # blog.html specific stagger
        content = content.replace('<div class="blog-grid">', '<div class="blog-grid stagger-children">')
        content = content.replace('<div class="blog-hero">', '<div class="blog-hero fade-in-section">')
        
        # 5. Add Footer and Float Buttons
        content = content.replace('    <script src="script.js"></script>', script_replacement)
        
        with open(file, 'w') as f:
            f.write(content)
        
        print(f"Updated {file}")
