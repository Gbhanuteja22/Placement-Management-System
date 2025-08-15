const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    const uri = 'mongodb+srv://placementuser:PHVyWIorHRAjpkG8@cluster0.r3wjefb.mongodb.net/placement_management?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('📡 Connecting to:', uri.replace(/:[^:@]*@/, ':****@'));
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('📋 Connection details:');
    console.log('  - Host:', mongoose.connection.host);
    console.log('  - Database:', mongoose.connection.db.databaseName);
    console.log('  - Ready state:', mongoose.connection.readyState);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ name: String, timestamp: Date });
    const TestModel = mongoose.model('Test', testSchema);
    
    console.log('🧪 Testing document creation...');
    const testDoc = new TestModel({ name: 'connection-test', timestamp: new Date() });
    await testDoc.save();
    console.log('✅ Document created successfully!');
    
    // Clean up
    await TestModel.deleteOne({ name: 'connection-test' });
    console.log('🧹 Test document cleaned up');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit();
  }
}

testConnection();
