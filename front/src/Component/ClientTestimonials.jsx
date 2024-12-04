import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Box, Typography, Card, CardContent, Avatar, Button, TextField } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import axios from 'axios';

// Arrow Styles
const arrowStyle = {
  backgroundColor: 'transparent',
  color: 'black',
  borderRadius: '50%',
  width: '35px',
  height: '35px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
  cursor: 'pointer',
  opacity: 0.8,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  '&:hover': {
    opacity: 1,
  },
};

// Slider Settings
const sliderSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: true,
  nextArrow: <ArrowCircleRightIcon sx={arrowStyle} />,
  prevArrow: <ArrowCircleLeftIcon sx={arrowStyle} />,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('http://localhost:6996/testimonials');
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !feedback || !avatar) {
      alert("Please fill in all fields.");
      return;
    }

    const newTestimonial = {
      name,
      feedback,
      role,
      avatar,
    };

    try {
      await axios.post('http://localhost:6996/testimonials', newTestimonial);
      setMessage("Testimonial submitted successfully!");
      setName('');
      setFeedback('');
      setRole('');
      setAvatar('');
      setShowForm(false);
    } catch (error) {
      setMessage("Error submitting testimonial.");
    }
  };

  const handleAddTestimonial = () => {
    setShowForm(true); 
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f7f7f7',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 'bold',
          color: '#3c3c3c',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          mb: 5,
          fontSize: '2rem',
        }}
      >
        What Our Clients Say
      </Typography>

      <Box sx={{ maxWidth: '800px', width: '100%' }}>
        <Slider {...sliderSettings}>
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              sx={{
                margin: '20px 0',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Avatar Image */}
                <Avatar
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 2,
                    border: '3px solid #f1f1f1',
                  }}
                />
                
                {/* Feedback Text */}
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: 'italic',
                    color: '#6c757d',
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  "{testimonial.feedback}"
                </Typography>

                {/* Name */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333333',
                    mb: 0.5,
                  }}
                >
                  {testimonial.name}
                </Typography>

                {/* Role */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#9e9e9e',
                    fontSize: '0.875rem',
                  }}
                >
                  {testimonial.role}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Slider>
      </Box>

      {!showForm ? (
        <Button
        variant="contained"
        sx={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px 20px',
            fontWeight: 'bold',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        onClick={handleAddTestimonial}
      >
        Add Your Testimonial
      </Button>
      ) : (
        <Box
          sx={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            width: '100%',
            marginTop: '30px',
          }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px',
            }}
          >
            Add Your Testimonial
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <TextField
              label="Feedback"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <TextField
              label="Role (Optional)"
              variant="outlined"
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <TextField
              label="Avatar URL"
              variant="outlined"
              fullWidth
              required
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '10px 20px',
                fontWeight: 'bold',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              Submit Testimonial
            </Button>
       
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#7b1fa2',
                color: '#fff',
                padding: '10px 20px',
                fontWeight: 'bold',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#7b1fa2',
                },
                marginLeft: '10px',
              }}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </form>
          {message && (
            <Typography
              variant="body1"
              sx={{
                marginTop: '20px',
                color: message.includes('success') ? 'green' : 'red',
                textAlign: 'center',
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Testimonials;
