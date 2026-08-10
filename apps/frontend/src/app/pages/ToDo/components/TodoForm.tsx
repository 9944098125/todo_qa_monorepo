import React from 'react';
import { ToDoList } from '../TodoData';

export function ToDoForm() {
  return (
    <React.Fragment>
      <div className="bg-white/50 backdrop-blue-xl w-[90%] md:w-2/4 h-2/4 rounded-[0.8rem] border border-blue-600/70 p-5">
        <div className="px-4 py-2 md-4">
          <h4 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-pink-600 to-yellow-400 bg-clip-text text-transparent">
            ToDo List
          </h4>
        </div>
        <form>
          <div className="px-4 py-2 mb-4">
            {ToDoList.map(ToDo => (
              <div
                key={ToDo.id}
                className="bg-white rounded-lg shadow-md p-4 border hover:shadow-xl transition"
              >
                <h2 className="text-lg  text-grey-600">{ToDo.Name}</h2>
                <p className="text-gray-600">{ToDo.Time}</p>
              </div>
            ))}
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}
