
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-foreground">StudyShare</h3>
            <p className="text-muted-foreground mb-4">
              Empowering students through collaborative learning and smart study tools.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</a></li>
              <li><a href="/exam-corner" className="text-muted-foreground hover:text-foreground transition-colors">Exam Corner</a></li>
              <li><a href="/my-sheets" className="text-muted-foreground hover:text-foreground transition-colors">My Sheets</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © {currentYear} StudyShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
