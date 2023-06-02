import Card from 'react-bootstrap/Card';
import './Card.css';

function MyCard({ title, content, icon }) {
  return (
    <>
      {[
        // 'Primary',
        // 'Secondary',
        // 'Success',
        // 'Danger',
        // 'Warning',
        // 'Info',
        'Light',
        // 'Dark',
      ].map((variant) => (
        <Card
          bg={variant.toLowerCase()}
          key={variant}
          text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
          style={{ width: '18rem' }}
          className="mb-2"
        >
          <div className="icon-title">
            <div className='icon-card'>
            {icon}

            </div>
          <Card.Header>{title}</Card.Header>
          </div>
          <Card.Body>
            <Card.Title>{content}</Card.Title>
            <Card.Text>
              {/* Some quick example text to build on the card title and make up the
              bulk of the card's content. */}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default MyCard;
