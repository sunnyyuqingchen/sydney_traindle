import React from 'react';


class Icon extends React.Component {
    render(){
        return <a href={this.props.link}>
            <img src={this.props.logo}  className='footer-logo'/> 
        </a>
    }
}

class Footer extends React.Component {
    render() {
      return <div className="footer">
        <Icon logo='github-logo.svg' link='https://github.com/hempunyane/hempunyane.github.io'/>
        <Icon logo='sorryvol-traindle.svg' link='https://github.com/sorryvol'/>
      </div>;
    }
  }

export default Footer;