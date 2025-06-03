import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Siderbar';

import { Button, Col, Row, Typography, Layout, Avatar, Tag, Divider, Tooltip, Breadcrumb, Spin, message } from 'antd';
import { Link, useParams, history } from 'umi';
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  HomeOutlined,
  ReadOutlined,
  FileTextOutlined,
  BookOutlined,
  EllipsisOutlined,
  ArrowLeftOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  SaveOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const ChiTietBaiViet = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sidebarNavItems = [
    { key: '1', icon: <HomeOutlined />, text: 'Trang chủ', to: '/public/trang-chu' },
    { key: '2', icon: <ReadOutlined />, text: 'Lập trình', to: '/programming' },
    { key: '3', icon: <FileTextOutlined />, text: 'Bài viết', to: '/public/bai-viet' },
  ];

  const handleVoiceClick = () => {
    console.log('Voice mode activated');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy thông tin bài viết theo ID
        const response = await axios.get(`http://localhost:3000/blogPosts/${id}`);
        
        if (response.data) {
          // Lấy thông tin tác giả
          const authorResponse = await axios.get(`http://localhost:3000/users/${response.data.author_id}`);
          
          // Tạo dữ liệu bài viết với thông tin tác giả
          const postWithAuthor = {
            ...response.data,
            author: authorResponse.data?.full_name || 'Tác giả',
            authorAvatar: 'https://i.pravatar.cc/150?img=' + (parseInt(response.data.id) % 70), // Avatar ngẫu nhiên từ pravatar.cc
            likes: Math.floor(Math.random() * 200) + 50, // Tạo số lượt thích giả để hiển thị
            comments: Math.floor(Math.random() * 50) + 5, // Tạo số lượt bình luận giả để hiển thị
            shares: Math.floor(Math.random() * 30) + 2, // Tạo số lượt chia sẻ giả để hiển thị
            tags: response.data.slug?.split('-') || [] // Tạo tags từ slug
          };
          
          setPost(postWithAuthor);
          
          // Lấy các bài viết liên quan (các bài viết khác)
          const relatedResponse = await axios.get('http://localhost:3000/blogPosts');
          const filteredRelated = relatedResponse.data
            .filter((post: any) => post.id !== id && post.status === 'published')
            .slice(0, 3); // Lấy tối đa 3 bài viết liên quan
          
          setRelatedPosts(filteredRelated);
        } else {
          // Nếu không tìm thấy bài viết, chuyển hướng về trang danh sách
          message.error('Không tìm thấy bài viết');
          history.push('/public/bai-viet');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        message.error('Đã xảy ra lỗi khi tải bài viết');
        history.push('/public/bai-viet');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Layout style={{ margin: '100px 120px 60px' }}>
          <Content style={{ marginTop: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" tip="Đang tải bài viết..." />
          </Content>
        </Layout>
        <Footer />
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Layout style={{ margin: '100px 120px 60px' }}>
          <Content style={{ marginTop: 40 }}>
            <div>Không tìm thấy bài viết</div>
          </Content>
        </Layout>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout style={{ margin: '100px 120px 60px' }}>
        {/* Sidebar */}
        <Sidebar navItems={sidebarNavItems} onVoiceClick={handleVoiceClick} />

        <Content style={{ marginTop: 40 }}>
          <Row gutter={24}>
            {/* Main Content - Blog Detail */}
            <Col xs={24} sm={24} md={18} lg={18}>
              {/* Breadcrumb navigation */}
              <Breadcrumb style={{ marginBottom: 20 }}>
                <Breadcrumb.Item>
                  <Link to="/public/trang-chu">
                    <HomeOutlined /> Trang chủ
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/public/bai-viet">Bài viết</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{post.title}</Breadcrumb.Item>
              </Breadcrumb>

              {/* Back button */}
              <Button
                icon={<ArrowLeftOutlined />}
                style={{ marginBottom: 20 }}
                onClick={() => history.push('/public/bai-viet')}
              >
                Quay lại danh sách bài viết
              </Button>

              {/* Article content */}
              <div style={{ background: '#fff', borderRadius: '8px', padding: '30px', marginBottom: '20px' }}>
                {/* Article header */}
                <div style={{ marginBottom: '24px' }}>
                  <Title level={2} style={{ fontWeight: 700, marginBottom: '16px' }}>
                    {post.title}
                  </Title>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Avatar src={post.authorAvatar} size={40} />
                    <div style={{ marginLeft: '12px' }}>
                      <Text strong style={{ display: 'block', fontSize: '16px' }}>
                        {post.author}
                      </Text>
                      <Text type="secondary">Đăng ngày {new Date(post.published_at || post.created_at).toLocaleDateString('vi-VN')}</Text>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                    {post.tags.map((tag: string, tagIndex: number) => (
                      <Tag key={tagIndex} style={{ background: '#f5f5f5', border: 'none', color: '#666' }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>

                  {/* Featured image */}
                  <div style={{ marginBottom: '24px' }}>
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }}
                    />
                  </div>
                </div>

                {/* Article body */}
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: post.content_format === 'markdown' ? post.content : post.content }}
                  style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}
                />

                {/* Article footer - engagement */}
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <Button icon={<LikeOutlined />} size="large">
                      {post.likes} Thích
                    </Button>
                    <Button icon={<MessageOutlined />} size="large">
                      {post.comments} Bình luận
                    </Button>
                    <Button icon={<ShareAltOutlined />} size="large">
                      {post.shares} Chia sẻ
                    </Button>
                  </div>
                  <Button icon={<SaveOutlined />} size="large" type="primary">
                    Lưu bài viết
                  </Button>
                </div>
              </div>

              {/* Related articles section */}
              <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
                <Title level={3} style={{ marginBottom: '20px' }}>
                  Bài viết liên quan
                </Title>

                <Row gutter={[16, 16]}>
                  {relatedPosts.map((relatedPost) => (
                    <Col xs={24} md={8} key={relatedPost.id}>
                      <Link to={`/public/bai-viet/chi-tiet/${relatedPost.id}`}>
                        <div style={{ marginBottom: '20px' }}>
                          <img
                            src={relatedPost.thumbnail}
                            alt={relatedPost.title}
                            style={{
                              width: '100%',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              marginBottom: '10px',
                            }}
                          />
                          <Paragraph strong ellipsis={{ rows: 2 }} style={{ fontSize: '14px' }}>
                            {relatedPost.title}
                          </Paragraph>
                        </div>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>

            {/* Right Sidebar */}
            <Col xs={24} sm={24} md={5} lg={5} offset={1}>
              {/* Author info */}
              <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <Title level={5} style={{ textAlign: 'center', marginBottom: '16px' }}>
                  Tác giả
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <Avatar src={post.authorAvatar} size={80} />
                  <Text strong>{post.author}</Text>
                  <Button type="primary" shape="round" size="small">
                    Theo dõi
                  </Button>
                </div>
              </div>

              {/* Popular topics */}
              <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <Title level={5} style={{ textAlign: 'center', marginBottom: '16px' }}>
                  Chủ đề phổ biến
                </Title>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Tag color="blue" style={{ margin: '4px', cursor: 'pointer' }}>
                    Frontend
                  </Tag>
                  <Tag color="green" style={{ margin: '4px', cursor: 'pointer' }}>
                    Backend
                  </Tag>
                  <Tag color="orange" style={{ margin: '4px', cursor: 'pointer' }}>
                    ReactJS
                  </Tag>
                  <Tag color="purple" style={{ margin: '4px', cursor: 'pointer' }}>
                    NodeJS
                  </Tag>
                  <Tag color="red" style={{ margin: '4px', cursor: 'pointer' }}>
                    DevOps
                  </Tag>
                  <Tag color="cyan" style={{ margin: '4px', cursor: 'pointer' }}>
                    Database
                  </Tag>
                  <Tag color="magenta" style={{ margin: '4px', cursor: 'pointer' }}>
                    UX/UI
                  </Tag>
                  <Tag color="gold" style={{ margin: '4px', cursor: 'pointer' }}>
                    Mobile
                  </Tag>
                </div>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default ChiTietBaiViet; 