import dbConnect from '../../../lib/dbConnect';
import Task from '../../models/Task';

export async function GET(request) {
  await dbConnect(); 

  try {
    const tasks = await Task.find({}); 
    return new Response(JSON.stringify({ success: true, data: tasks }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message || 'Server Error' }), {
      status: 500, 
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(request) {
  await dbConnect(); 

  try {
    const body = await request.json(); 
    const task = await Task.create(body); 
    return new Response(JSON.stringify({ success: true, data: task }), {
      status: 201, 
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message || 'Bad Request' }), {
      status: 400, 
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT() {
  return new Response(null, { status: 405 });
}
export async function DELETE() {
  return new Response(null, { status: 405 });
}
