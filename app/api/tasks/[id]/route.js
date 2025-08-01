// app/api/tasks/[id]/route.js
import dbConnect from '../../../../lib/dbConnect';
import Task from '../../../../app/models/Task';

// GET a specific task by ID
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params; // Extract ID from the dynamic route parameter

  try {
    const task = await Task.findById(id);
    if (!task) {
      return new Response(JSON.stringify({ success: false, message: 'Task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return new Response(JSON.stringify({ success: true, data: task }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // If ID format is invalid (e.g., not a valid MongoDB ObjectId), Mongoose might throw an error
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500, // Or 400 if it's a specific validation error for the ID
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// PUT (Update) a specific task by ID
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await request.json(); // Get the JSON body from the request
    const task = await Task.findByIdAndUpdate(id, body, {
      new: true, // Return the modified document rather than the original
      runValidators: true, // Run Mongoose validators on the update operation
    });
    if (!task) {
      return new Response(JSON.stringify({ success: false, message: 'Task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return new Response(JSON.stringify({ success: true, data: task }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Handle validation errors from Mongoose or other update errors
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 400, // Typically 400 for bad request (e.g., validation failure)
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// DELETE a specific task by ID
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedTask = await Task.deleteOne({ _id: id });
    // Check if any document was actually deleted
    if (deletedTask.deletedCount === 0) {
      return new Response(JSON.stringify({ success: false, message: 'Task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return new Response(JSON.stringify({ success: true, data: {} }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}