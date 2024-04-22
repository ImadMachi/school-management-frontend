export function mapSenderData(sender: any) {
  if (sender.director) {
    sender.senderData = sender.director;
    delete sender.director;
  } else if (sender.administrator) {
    sender.senderData = sender.administrator;
    delete sender.administrator;
  } else if (sender.teacher) {
    sender.senderData = sender.teacher;
    delete sender.teacher;
  } else if (sender.student) {
    sender.senderData = sender.student;
    delete sender.student;
  } else if (sender.parent) {
    sender.senderData = sender.parent;
    delete sender.parent;
  } else if (sender.agent) {
    sender.senderData = sender.agent;
    delete sender.agent;
  }
}

export function mapUserData(user: any) {
  if (user.director) {
    user.userData = user.director;
    delete user.director;
  } else if (user.administrator) {
    user.userData = user.administrator;
    delete user.administrator;
  } else if (user.teacher) {
    user.userData = user.teacher;
    delete user.teacher;
  } else if (user.student) {
    user.userData = user.student;
    delete user.student;
  } else if (user.parent) {
    user.userData = user.parent;
    delete user.parent;
  } else if (user.agent) {
    user.userData = user.agent;
    delete user.agent;
  }
}
